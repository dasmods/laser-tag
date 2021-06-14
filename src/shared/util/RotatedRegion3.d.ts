interface RotatedRegion3 {
	/**
	 * returns true or false if the point is within the RotatedRegion3 object
	 */
	CastPoint(point: Vector3): boolean;

	/**
	 * returns true or false if the part is withing the RotatedRegion3 object
	 */
	CastPart(part: BasePart): boolean;

	/**
	 * returns array of parts in the RotatedRegion3 object
	 * will return a maximum number of parts in array [maxParts] the default is 20
	 * parts that either are descendants of or actually are the [ignore] instance will be ignored
	 */
	FindPartsInRegion3(ignore?: Instance, maxParts?: number): BasePart[];

	/**
	 * returns array of parts in the RotatedRegion3 object
	 * will return a maximum number of parts in array [maxParts] the default is 20
	 * parts that either are descendants of the [ignore array] or actually are the [ignore array] instances will be ignored
	 */
	FindPartsInRegion3WithIgnoreList(ignore?: Instance[], maxParts?: number): BasePart[];

	/**
	 * returns array of parts in the RotatedRegion3 object
	 * will return a maximum number of parts in array [maxParts] the default is 20
	 * parts that either are descendants of the [whiteList array] or actually are the [whiteList array] instances are all that will be checked
	 */
	FindPartsInRegion3WithWhiteList(whiteList: Instance[], maxParts?: number): BasePart[];

	/**
	 * Same as the `:FindPartsInRegion3WithIgnoreList` method, but will check if the ignore argument is an array or single instance
	 */
	Cast(ignore?: Instance | Instance[], maxParts?: number): BasePart[];

	/**
	 * cframe that represents the center of the region
	 */
	readonly CFrame: CFrame;

	/**
	 * vector3 that represents the size of the region
	 */
	readonly Size: Vector3;

	/**
	 * string that represents the shape type of the RotatedRegion3 object
	 */
	readonly Shape: string;

	/**
	 * array of vector3 that are passed to the support function
	 */
	readonly Set: Vector3[];

	/**
	 * function that is used for support in the GJK algorithm
	 */
	readonly Support: <T, R>(...args: T[]) => R;

	/**
	 * vector3 that represents the center of the set, again used for the GJK algorithm
	 */
	readonly Centroid: Vector3;

	/**
	 * standard region3 that represents the world bounding box of the RotatedRegion3 object
	 */
	readonly AlignedRegion3: Region3;
}

interface RotatedRegion3Constructor {
	new (cFrame: CFrame, size: Vector3): RotatedRegion3;
}

/**
 * Creates a region from a cframe which acts as the center of the region and size which extends to
 * the corners like a block part. This is the exact same as the region.new constructor, but has a
 * different name.
 */
export declare const Block: (cFrame: CFrame, size: Vector3) => RotatedRegion3;

/**
 * Creates a region from a cframe which acts as the center of the region and size which extends to
 * the corners like a wedge part.
 */
export declare const Wedge: (cFrame: CFrame, size: Vector3) => RotatedRegion3;

//  /**
//   * Creates a region from a cframe which acts as the center of the region and size which extends to
//   * the corners like a cornerWedge part.
//   */
export declare const CornerWedge: (cFrame: CFrame, size: Vector3) => RotatedRegion3;

//  /**
//   * Creates a region from a cframe which acts as the center of the region and size which extends to
//   * the corners like a cylinder part.
//   */
export declare const Cylinder: (cFrame: CFrame, size: Vector3) => RotatedRegion3;

//  /**
//   * Creates a region from a cframe which acts as the center of the region and size which extends to
//   * the corners like a ball part.
//   */
export declare const Ball: (cFrame: CFrame, size: Vector3) => RotatedRegion3;

//  /**
//   * Creates a region from a part in the game. It can be used on any base part, but the region
//   * will treat unknown shapes (meshes, unions, etc) as block shapes.
//   */
export declare const FromPart: (part: BasePart) => RotatedRegion3;

export declare const RotatedRegion3: RotatedRegion3Constructor;
