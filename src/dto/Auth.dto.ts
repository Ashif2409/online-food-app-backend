import { VandorPayload } from "./Vandor.dto";
import {CustomerPayload} from './Customer.dto'
export type AuthPayLoad = VandorPayload | CustomerPayload;