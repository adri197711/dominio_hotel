import { UsersService } from "./UsersService";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("getAll obtiene lista de usuarios", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: [{ id: "1", name: "Juan" }] });
  const result = await UsersService.getAll();
  expect(result).toEqual([{ id: "1", name: "Juan" }]);
  expect(mockedAxios.get).toHaveBeenCalledWith("/api/users");
});
