import TrackingBrandModel from '../models/trackerBrand';
import moment from 'moment'

function omit<T extends object, K extends keyof T>(obj: T, ...props: K[]): Omit<T, K> {
    const result = { ...obj } as T;
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function trackerBrandRepositoryMongoDB() {

    const upsertByBrandId = async (brandId: string, updateModel: object) => {
        const filter = { brandId: brandId };
        const update = updateModel;
        const options = { upsert: true };
        return await TrackingBrandModel.findOneAndUpdate(filter, update, options);
    }



    return {
        upsertByBrandId,
    };
}



