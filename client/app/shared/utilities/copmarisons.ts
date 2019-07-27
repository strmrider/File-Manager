import { FileItem } from "../models/file-system/file items/file-item";
import { ComparisonResult } from "../enums/comparison-result";

export class Comparisons {
  constructor() {}

  static valueCmp(value1: any, value2: any, ascending = true) {
    if (value1 > value2) {
      if (ascending) return ComparisonResult.Lesser;
      else return ComparisonResult.Greater;
    } else if (value1 < value2) {
      if (ascending) return ComparisonResult.Greater;
      else return ComparisonResult.Lesser;
    } else return ComparisonResult.Equal;
  }

  static valueToObjCmp(value1: any, obj: any) {
    if (value1 > obj.id) {
      return ComparisonResult.Equal;
    } else if (value1 < obj.id) {
      return ComparisonResult.Lesser;
    } else return ComparisonResult.Equal;
  }

  static objIdCmp(first: FileItem, second: FileItem) {
    return Comparisons.valueCmp(first.id, second.id);
  }

  static parentCmp(parent: string, file: FileItem) {
    Comparisons.valueCmp(parent, file.parent.id);
  }

  static objNameCmp(first: FileItem, second: FileItem) {
    return Comparisons.valueCmp(first.name, second.name);
  }

  private static dirFileCmp(first: any, second: any, ascending = true) {
    first = first.isShortcut ? first.reference : first;
    second = second.isShortcut ? second.reference : second;
    if (first.isDirectory && !second.isDirectory) {
      if (ascending) return ComparisonResult.Lesser;
      else return ComparisonResult.Equal;
    } else if (second.isDirectory && !first.isDirectory) {
      if (ascending) return ComparisonResult.Equal;
      else return ComparisonResult.Lesser;
    } else return ComparisonResult.Equal;
  }

  static dateCmp(first: FileItem, second: FileItem, ascending = true) {
    var res = Comparisons.dirFileCmp(first, second, ascending);
    if (res == ComparisonResult.Equal)
      return first.dates.creation.compare(second.dates.creation);
    else return res;
  }

  static nameCmp(first: FileItem, second: FileItem, ascending = true) {
    var res = Comparisons.dirFileCmp(first, second, ascending);
    if (res == ComparisonResult.Equal)
      return Comparisons.valueCmp(first.name, second.name);
    else return res;
  }

  private static handlDirectSizeCmp(
    first: FileItem,
    second: FileItem,
    ascending
  ) {
    if (
      (first.isShortcut && second.isShortcut) ||
      (!first.isShortcut && second.isShortcut)
    )
      return ComparisonResult.Greater;
    else if (first.isShortcut && !second.isShortcut)
      return ComparisonResult.Lesser;
    else {
      let f: any = first;
      let s: any = second;
      return Comparisons.valueCmp(f.size.size, s.size.size, ascending);
    }
  }
  static sizeCmp(first: FileItem, second: FileItem, ascending = true) {
    var res = Comparisons.dirFileCmp(first, second, ascending);
    if (res == ComparisonResult.Equal) {
      if (first.isDirectory && second.isDirectory)
        return ComparisonResult.Equal;
      else return Comparisons.handlDirectSizeCmp(first, second, ascending);
    } else {
      return res;
    }
  }
}
