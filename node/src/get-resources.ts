import { Resource, ResourcesData } from "./types/resources";

export function getAllowedResources(resourceData: ResourcesData, allowedResources: number[]) {
  let resource: Resource[] = [];
  allowedResources.forEach((allowedResource) => {
    resource.push(resourceData.resources.find(r => r.resource_id === allowedResource) as Resource);
  });
  return resource.filter(r => r.resource_id !=1 );
}
