import { Leaf } from "./leaf";
import { ComparisonResult } from "src/app/shared/enums/comparison-result";

export class BinaryTree {
  private _size: number = 0;
  private _root: Leaf;
  constructor() {}

  get root() {
    return this._root;
  }

  get size() {
    return this._size;
  }

  private _add(node: Leaf, newNode: Leaf, cmpFunc: Function) {
    if (node == null) return null;

    if (cmpFunc(newNode.elm, node.elm) > 0) {
      if (this._add(node.right, newNode, cmpFunc) == null) node.right = newNode;
    } else {
      if (this._add(node.left, newNode, cmpFunc) == null) node.left = newNode;
    }

    return 1;
  }

  public addLeaf(newNode: Leaf, cmpFunc: Function) {
    if (this.size == 0) {
      this._root = newNode;
    } else this._add(this.root, newNode, cmpFunc);

    this._size++;
  }

  public add(value: any, cmpFunc: Function) {
    this.addLeaf(new Leaf(value), cmpFunc);
  }

  private minimum(node: Leaf) {
    if (node.left === null) return node;
    else return this.minimum(node.left);
  }

  private _remove(node: Leaf, value: any, cmpFunc: Function) {
    if (node === null) return node;

    if (cmpFunc(value, node.elm) == ComparisonResult.Greater)
      node.right = this._remove(node.right, value, cmpFunc);
    else if (cmpFunc(value, node.elm) == ComparisonResult.Lesser)
      node.left = this._remove(node.left, value, cmpFunc);
    else {
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }

      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      } else {
        var replacer = this.minimum(node.right);
        node.elm = replacer.elm;

        node.right = this._remove(node.right, replacer.elm, cmpFunc);
        return node;
      }
    }

    return node;
  }

  public remove(value: any, cmpFunc: Function) {
    var removed = null;
    if (this.size > 0) {
      this._root = this._remove(this.root, value, cmpFunc);
      this._size--;
    }
    return removed;
  }

  private _search(node: Leaf, value: any, cmpFunc: Function) {
    if (node == null) return;

    var cmpResult = cmpFunc(value, node.elm);
    if (cmpResult == ComparisonResult.Equal) {
      return node;
    } else if (cmpResult == ComparisonResult.Lesser) {
      return this._search(node.right, value, cmpFunc);
    } else if (cmpResult == ComparisonResult.Greater) {
      return this._search(node.left, value, cmpFunc);
    } else return null;
  }

  public search(value: any, cmpFunc: Function) {
    if (this.size == 0) return null;
    else {
      var result = this._search(this.root, value, cmpFunc);
      if (result != null) {
        return result;
      } else return null;
    }
  }

  public toArray(node = this.root, arr = []) {
    if (node) {
      arr.push(node.elm);
      this.toArray(node.left, arr);
      this.toArray(node.right, arr);
    }

    return arr;
  }
}
