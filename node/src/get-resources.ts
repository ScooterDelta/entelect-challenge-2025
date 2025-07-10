import { Resource, ResourcesData } from "./types/resources";

export function getAllowedResources(resourceData:ResourcesData, allowedReaources: number[]){
    let resournce : Resource[] = [];
    allowedReaources.forEach((resouce) => {
        resournce.push(resourceData.resources[resouce]);  
    });
    return resournce;
}