import {Response,HostFunctions,MsgPack,Return} from './sdk';
export class AccountAssetU64 {
    private accountId:string;
    constructor(accountId:string) {
        this.accountId = accountId;
    }
    zero():u64 {
        return 0;
    }
    balance():u64 {
        const value = HostFunctions.loadAsset(this.accountId);
        if(Response.isEmpty(value)) {
            return this.zero();
        }
        return MsgPack.deserializeInternalType<u64>(value);
    }
    add(value:u64):boolean {
        const balance = this.balance();
        if(balance != this.zero()) {
            value += balance;
        }
        HostFunctions.storeAsset(this.accountId,MsgPack.serializeInternalType<u64>(value));
        return true;
    }
    sub(value:u64):boolean {
        const balance = this.balance();
        if(balance >= value) {
            const newBalance = balance - value;
            HostFunctions.storeAsset(this.accountId,MsgPack.serializeInternalType<u64>(newBalance));
            return true;
        }
        return false;
    }
    divide(amount:u64,fractionsArray:u64[]):u64[] {
        // 101,[3,3,3]
        const u64Start:u64=0;
        const total = fractionsArray.reduce((acc,nextItem) => {return acc+nextItem;},u64Start);
        const results:u64[] = new Array<u64>(fractionsArray.length);
        for(let i=0;i<fractionsArray.length;i++) {
            results[i] = amount*fractionsArray[i]/total
        }
        //rest = 2
        results[0] += (amount - results.reduce(((acc:u64,nextItem:u64):u64 => acc+nextItem ),u64Start));
        return results;
        
    }
 }
export class OwnerDB {
    static get<T>(key:string):T {
        const valSer = HostFunctions.loadData(key);
        return  MsgPack.deserializeInternalType<T>(valSer);
    }
    static set<T>(key:string,val:T):u8[] {
        const valSer = MsgPack.serializeInternalType<T>(val);
        HostFunctions.storeData(key,valSer);
        return valSer;
    }
    static getObject<T>(key:string):T {
        const valSer = HostFunctions.loadData(key);
        return  MsgPack.deserialize<T>(valSer);
    }
    static setObject<T>(key:string,val:T):u8[] {
        const valSer = MsgPack.serialize<T>(val);
        HostFunctions.storeData(key,valSer);
        return valSer;
    }
    static has(key:string):boolean {
        const ret = HostFunctions.getKeys(key);
        return ret.length > 0;
    }
    static delete(key:string):boolean {
        if(this.has(key)) {
            HostFunctions.removeData(key);
            return true;
        }
        return false;
    }
}