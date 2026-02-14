;; PayWall.xyz Smart Contract
(define-constant contract-owner tx-sender)
(define-constant err-insufficient-payment (err u100))
(define-constant err-content-not-found (err u101))
(define-constant err-already-unlocked (err u102))
(define-constant err-unauthorized (err u103))
(define-constant platform-fee-percent u10)

(define-map content-access {user: principal, content-id: uint} bool)
(define-map content-prices uint uint)
(define-map content-creators uint principal)

(define-public (register-content (content-id uint) (price uint))
  (begin
    (asserts! (is-none (map-get? content-creators content-id)) err-unauthorized)
    (map-set content-creators content-id tx-sender)
    (map-set content-prices content-id price)
    (ok content-id)))

(define-public (unlock-content (content-id uint))
  (let (
    (price (unwrap! (map-get? content-prices content-id) err-content-not-found))
    (creator (unwrap! (map-get? content-creators content-id) err-content-not-found))
    (already-unlocked (default-to false (map-get? content-access {user: tx-sender, content-id: content-id})))
    (platform-fee (/ (* price platform-fee-percent) u100))
    (creator-amount (- price platform-fee)))
    (asserts! (not already-unlocked) err-already-unlocked)
    (try! (stx-transfer? creator-amount tx-sender creator))
    (try! (stx-transfer? platform-fee tx-sender contract-owner))
    (map-set content-access {user: tx-sender, content-id: content-id} true)
    (ok true)))

(define-read-only (has-access (user principal) (content-id uint))
  (default-to false (map-get? content-access {user: user, content-id: content-id})))

(define-read-only (get-content-price (content-id uint))
  (map-get? content-prices content-id))

(define-read-only (get-content-creator (content-id uint))
  (map-get? content-creators content-id))
