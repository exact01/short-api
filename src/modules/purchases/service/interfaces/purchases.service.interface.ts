import { ICommandResponse } from '../../../../common/types/command-response.type';
import { IPurchase } from './purchases.interface';
export interface IPurchaseService {
    purchase: (dto: IPurchase) => Promise<ICommandResponse<number>>;
}
