import z from "zod";
import {selectCheckinSchema, userCheckinSchemaFormified} from "./zod";

export type Checkin = z.infer<typeof selectCheckinSchema>;
export type CheckInUserClientProps = z.infer<typeof userCheckinSchemaFormified>;