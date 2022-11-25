import type { JwtPayload } from "jsonwebtoken";

interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export default UserTokenPayload;
