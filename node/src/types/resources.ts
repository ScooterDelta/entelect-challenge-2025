export type Resource =
{
    resource_id: number;
    name: string;
    type: string;
    bounding_box: number;
    cost: number;
    interest_factor: number;
    incompatible_with: number[];
    orientations: {
        rotation: number;
        cells: [number, number][]
    }
}

export type ResourcesData =
{
    resources: Resource[];
}
