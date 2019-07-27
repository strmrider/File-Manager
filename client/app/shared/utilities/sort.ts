export class Sort {
  constructor() {}

  public quickSort(arr: any[], cmpFunc: Function) {
    this._quickSort(arr, 0, arr.length - 1, cmpFunc);
  }

  private _quickSort(
    arr: any[],
    start: number,
    end: number,
    cmpFunc: Function
  ) {
    if (start < end) {
      let pivot = this.partition(arr, start, end, cmpFunc);
      this._quickSort(arr, start, pivot - 1, cmpFunc);
      this._quickSort(arr, pivot + 1, end, cmpFunc);
    }
  }

  private partition(arr: any[], start: number, end: number, cmpFunc: Function) {
    let pivot = end;
    let i = start - 1;
    let j = start;

    while (j < pivot) {
      if (cmpFunc(arr[j], arr[pivot]) > 0) {
        j++;
      } else {
        i++;
        this.swap(arr, j, i);
        j++;
      }
    }
    this.swap(arr, i + 1, pivot);
    return i + 1;
  }

  private swap(arr: any[], i: number, j: number) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
