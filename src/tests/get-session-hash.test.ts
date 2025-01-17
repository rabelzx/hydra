import { getSessionHash } from "../src/main/events/auth/get-session-hash";
import { userAuthRepository } from "@main/repository";
import * as jwt from "jsonwebtoken";

jest.mock("@main/repository", () => ({
  userAuthRepository: {
    findOne: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  decode: jest.fn(),
}));

test('deve retornar sessionId quando auth e payload forem válidos', async () => {
  userAuthRepository.findOne.mockResolvedValue({ accessToken: "validToken" });
  jwt.decode.mockReturnValue({ sessionId: "1234" });

  const sessionId = await getSessionHash();

  expect(sessionId).toBe("1234");
});

test('deve retornar null quando auth for inválido', async () => {
  userAuthRepository.findOne.mockResolvedValue(null);

  const sessionId = await getSessionHash();

  expect(sessionId).toBeNull();
});

test('deve retornar null quando o payload for inválido', async () => {
  userAuthRepository.findOne.mockResolvedValue({ accessToken: "validToken" });
  jwt.decode.mockReturnValue(null);

  const sessionId = await getSessionHash();

  expect(sessionId).toBeNull();
});
