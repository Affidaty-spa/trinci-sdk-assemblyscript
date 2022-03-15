import { default as Utils } from './utils';
import { default as MsgPack } from './msgpack';
import { default as Types } from './types';

/**
 * Helper functions that create, encode and save to memory various smart contract return types
 */
export namespace Return {
    /**
     * Returns an Error with passed error message
     * @param message - Error message
     */
    export function Error(message:string):Types.TCombinedPtr {
        return MsgPack.appOutputEncode(false, Utils.stringtoU8Array(message));
    }

    /**
     * Returns a combined pointer to passed bytes wrapped in a 'Success' response when T is an internal type as:string,u32,ecc...;
     * @param resultBytes - Bytes you want to return
    */
    export function Success<T>(val:T):Types.TCombinedPtr {
        return MsgPack.appOutputEncode(true, MsgPack.serializeInternalType<T>(val));
    }
    /**
     * Returns a combined pointer to passed bytes wrapped in a 'Success' response when O is a class decorated in @msgpackable;
     * @param resultBytes - Bytes you want to return
    */
     export function SuccessAsObject<O>(obj:O):Types.TCombinedPtr {
        return MsgPack.appOutputEncode(true, MsgPack.serialize<O>(obj));
    }

    /**
     * Returns a combined pointer to encoded 'true' value wrapped in a 'Success' response;
     */
    export function True():Types.TCombinedPtr {
        return MsgPack.appOutputEncode(true, [0xc3]);
    }

    /**
     * Returns a combined pointer to encoded 'false' value wrapped in a 'Success' response;
     */
    export function False():Types.TCombinedPtr {
        return MsgPack.appOutputEncode(true, [0xc2]);
    }

    /**
     * Returns a combined pointer to encoded 'null' value wrapped in a 'Success' response;
     */
    export function Null():Types.TCombinedPtr {
        return MsgPack.appOutputEncode(true, [0xc0]);
    }
}

export namespace Response {
    export function isSome(data: u8[]): boolean {
        return data.length > 0;
    }

    export function isEmpty(data: u8[]): boolean {
        return data.length <= 0;
    }
}
