import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("PayWall.xyz Smart Contract", () => {
  describe("register-content", () => {
    it("allows creator to register content with price", () => {
      const { result } = simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(1), Cl.uint(1000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(1));
    });

    it("prevents duplicate content registration", () => {
      simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(2), Cl.uint(1000000)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(2), Cl.uint(2000000)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(103)); // err-unauthorized
    });

    it("allows different users to register different content", () => {
      const result1 = simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(3), Cl.uint(1000000)],
        wallet1
      );
      expect(result1.result).toBeOk(Cl.uint(3));

      const result2 = simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(4), Cl.uint(2000000)],
        wallet2
      );
      expect(result2.result).toBeOk(Cl.uint(4));
    });
  });

  describe("unlock-content", () => {
    beforeEach(() => {
      // Register content for tests
      simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(10), Cl.uint(1000000)],
        wallet1
      );
    });

    it("allows user to unlock content and transfers STX correctly", () => {
      const wallet2BalanceBefore = simnet.getAssetsMap().get("STX")?.get(wallet2) || 0;
      const wallet1BalanceBefore = simnet.getAssetsMap().get("STX")?.get(wallet1) || 0;
      const deployerBalanceBefore = simnet.getAssetsMap().get("STX")?.get(deployer) || 0;

      const { result } = simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(10)],
        wallet2
      );
      expect(result).toBeOk(Cl.bool(true));

      const wallet2BalanceAfter = simnet.getAssetsMap().get("STX")?.get(wallet2) || 0;
      const wallet1BalanceAfter = simnet.getAssetsMap().get("STX")?.get(wallet1) || 0;
      const deployerBalanceAfter = simnet.getAssetsMap().get("STX")?.get(deployer) || 0;

      // Verify 90/10 revenue split: 900,000 to creator, 100,000 to platform
      expect(wallet2BalanceAfter).toBe(wallet2BalanceBefore - 1000000);
      expect(wallet1BalanceAfter).toBe(wallet1BalanceBefore + 900000);
      expect(deployerBalanceAfter).toBe(deployerBalanceBefore + 100000);
    });

    it("prevents unlocking non-existent content", () => {
      const { result } = simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(9999)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(101)); // err-content-not-found
    });

    it("prevents duplicate unlocking", () => {
      simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(10)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(10)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(102)); // err-already-unlocked
    });

    it("allows different users to unlock the same content", () => {
      const result1 = simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(10)],
        wallet2
      );
      expect(result1.result).toBeOk(Cl.bool(true));

      // Register another content for this test
      simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(11), Cl.uint(1000000)],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(11)],
        deployer
      );
      expect(result2.result).toBeOk(Cl.bool(true));
    });
  });

  describe("revenue split calculation", () => {
    it("correctly splits 10% platform fee and 90% creator fee", () => {
      const testCases = [
        { price: 1000000, creatorAmount: 900000, platformFee: 100000 },
        { price: 5000000, creatorAmount: 4500000, platformFee: 500000 },
        { price: 100000, creatorAmount: 90000, platformFee: 10000 },
        { price: 10000000, creatorAmount: 9000000, platformFee: 1000000 },
      ];

      testCases.forEach((testCase, index) => {
        const contentId = 100 + index;
        
        simnet.callPublicFn(
          "paywall",
          "register-content",
          [Cl.uint(contentId), Cl.uint(testCase.price)],
          wallet1
        );

        const wallet2BalanceBefore = simnet.getAssetsMap().get("STX")?.get(wallet2) || 0;
        const wallet1BalanceBefore = simnet.getAssetsMap().get("STX")?.get(wallet1) || 0;
        const deployerBalanceBefore = simnet.getAssetsMap().get("STX")?.get(deployer) || 0;

        simnet.callPublicFn(
          "paywall",
          "unlock-content",
          [Cl.uint(contentId)],
          wallet2
        );

        const wallet2BalanceAfter = simnet.getAssetsMap().get("STX")?.get(wallet2) || 0;
        const wallet1BalanceAfter = simnet.getAssetsMap().get("STX")?.get(wallet1) || 0;
        const deployerBalanceAfter = simnet.getAssetsMap().get("STX")?.get(deployer) || 0;

        expect(wallet2BalanceAfter).toBe(wallet2BalanceBefore - testCase.price);
        expect(wallet1BalanceAfter).toBe(wallet1BalanceBefore + testCase.creatorAmount);
        expect(deployerBalanceAfter).toBe(deployerBalanceBefore + testCase.platformFee);
      });
    });
  });

  describe("has-access", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(20), Cl.uint(1000000)],
        wallet1
      );
    });

    it("returns false for users without access", () => {
      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "has-access",
        [Cl.standardPrincipal(wallet2), Cl.uint(20)],
        wallet2
      );
      expect(result).toBeBool(false);
    });

    it("returns true for users with access", () => {
      simnet.callPublicFn(
        "paywall",
        "unlock-content",
        [Cl.uint(20)],
        wallet2
      );

      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "has-access",
        [Cl.standardPrincipal(wallet2), Cl.uint(20)],
        wallet2
      );
      expect(result).toBeBool(true);
    });

    it("returns false for non-existent content", () => {
      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "has-access",
        [Cl.standardPrincipal(wallet2), Cl.uint(9999)],
        wallet2
      );
      expect(result).toBeBool(false);
    });
  });

  describe("get-content-price", () => {
    it("returns price for registered content", () => {
      simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(30), Cl.uint(750000)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "get-content-price",
        [Cl.uint(30)],
        wallet1
      );
      expect(result).toBeSome(Cl.uint(750000));
    });

    it("returns none for non-existent content", () => {
      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "get-content-price",
        [Cl.uint(9999)],
        wallet1
      );
      expect(result).toBeNone();
    });
  });

  describe("get-content-creator", () => {
    it("returns creator for registered content", () => {
      simnet.callPublicFn(
        "paywall",
        "register-content",
        [Cl.uint(40), Cl.uint(1000000)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "get-content-creator",
        [Cl.uint(40)],
        wallet1
      );
      expect(result).toBeSome(Cl.standardPrincipal(wallet1));
    });

    it("returns none for non-existent content", () => {
      const { result } = simnet.callReadOnlyFn(
        "paywall",
        "get-content-creator",
        [Cl.uint(9999)],
        wallet1
      );
      expect(result).toBeNone();
    });
  });
});

