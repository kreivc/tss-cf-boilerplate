import z from "zod";
import { publicProcedure } from "../index";

export const accountRouter = {
  // Mock check user endpoint - returns username for given account ID
  checkUser: publicProcedure
    .input(
      z.object({
        accountId: z.string().min(1),
        gameSlug: z.string(),
        serverId: z.string().optional(),
      })
    )
    .handler(async ({ input }) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation - return success with mock username
      // In real implementation, this would call game's API to validate
      const mockUsernames: Record<string, string> = {
        "123456": "ProGamer2024",
        "654321": "GameMaster",
        "111111": "TopPlayer",
        "999999": "GamingLegend",
      };

      // Generate a username based on account ID or use mock
      const username =
        mockUsernames[input.accountId] ||
        `Player${input.accountId.slice(0, 4)}`;

      return {
        success: true,
        accountId: input.accountId,
        username,
        serverId: input.serverId || "Global",
      };
    }),
};
