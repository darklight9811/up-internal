import { Resend } from "resend";

import { env } from "../domains/app";

export const email = new Resend(env.resend);
