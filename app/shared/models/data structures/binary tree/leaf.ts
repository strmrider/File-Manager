export class Leaf {
  private _left: Leaf = null;
  private _right: Leaf = null;
  constructor(private _elm: any) {}

  get elm(): any {
    return this._elm;
  }

  get left(): Leaf {
    return this._left;
  }

  get right(): Leaf {
    return this._right;
  }

  set elm(elm) {
    this._elm = elm;
  }

  set right(right) {
    this._right = right;
  }

  set left(left) {
    this._left = left;
  }
}
