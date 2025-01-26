import type { Callback } from "@/app/utils/types.ts";
import type { BaseComponent } from "../base-components";
import { div, span } from "../tags.ts";
import classes from "./puzzle.module.scss";

export default class Puzzle {
  private elements: BaseComponent[] = [];

  private fixElements: BaseComponent[][] = [];

  private image: HTMLImageElement;

  private showOption: boolean;

  private dragging: BaseComponent | null = null;

  private puzzleClickCallback: (currentPuzzle: BaseComponent | undefined) => void;

  private dragStartCallback: Callback;

  private dargEndCallback: (currentPuzzle: BaseComponent) => void;

  constructor(image: HTMLImageElement,
    showOption: boolean,
    puzzleClickCallback: (currentPuzzle: BaseComponent | undefined) => void,
    dragStartCallback: Callback,
    dargEndCallback: (currentPuzzle: BaseComponent) => void,) {
    this.image = image;
    this.showOption = showOption;
    this.puzzleClickCallback = puzzleClickCallback;
    this.dragStartCallback = dragStartCallback;
    this.dargEndCallback = dargEndCallback;
  }

  public createPuzzle(width: number, height: number, line: number, wordCount: number, sentence: string[]): void{
    for (let word = 0; word < wordCount; word += 1) {
      const widthElement = Math.round(width / wordCount) + wordCount * 0.1;
      this.makeElement(line, word, wordCount, widthElement, height, sentence[word]);
    }
  }

  private makeElement(line: number, word: number, wordCount: number, width: number, height: number, text: string | undefined): void {
    let puzzleForm = classes.puzzleInside;
    if (word === 0) {
      puzzleForm = classes.puzzleFirst
    }
    if (word === wordCount - 1) {
      puzzleForm = classes.puzzleLast
    }
    const block = div({
      id: `bl-${line}-${word}`,
      className: `${classes.block} ${puzzleForm}`,
      draggable: true,
      ondragstart: this.dragStart,
      ondragend: this.dragEnd,
      onclick: this.onPuzzleClick
    },
      span({ className: classes.text, textContent: text })
    );
    const element = block.getElement();
    element.style.backgroundImage = this.showOption ? `url(${this.image.src})` : 'none';
    element.style.backgroundPosition = `-${word * width}px -${line * height}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.maskSize = `${width}px ${height}px`;
    this.elements.push(block);
  }
  
  public backgroundToggle = (value: boolean): void => {
    this.showOption = value;
    this.elements.forEach((puzzle) => {
      const puzzleElement = puzzle.getElement();
      puzzleElement.style.backgroundImage = value ? `url(${this.image.src})` : 'none';
    });
  }

  public fixLine(): void {
    this.fixElements.push(this.elements);
    this.elements.forEach((block) => {
      const blockElement = block.getElement();
      blockElement.ondragstart = null;
      blockElement.ondragend = null
      blockElement.onclick = null;
      blockElement.draggable = false;
    });
    this.elements = [];
  }

  public showBackground(): void {
    this.elements.forEach((puzzle) => {
      const blockElement = puzzle.getElement();
      blockElement.style.backgroundImage = `url(${this.image.src})`;
    });
  }

  public getElements(): BaseComponent[] {
    return this.elements;
  }

  private onPuzzleClick = (event: MouseEvent): void => {
    if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
      const idEl = event.currentTarget.id.split('-')[2];
      const currentPuzzle = this.elements[parseInt(idEl!, 10)];
      this.puzzleClickCallback(currentPuzzle);
    }
  }

  private dragStart = (event: DragEvent): void => {
    if (event.dataTransfer && event.target && event.target instanceof HTMLElement) {
      const idEl = event.target.id.split('-')[2];
      const currentBlock = this.elements[parseInt(idEl!, 10)];
      if (currentBlock) {
        this.dragging = currentBlock;
        setTimeout(() => currentBlock?.addClass(classes.dragging!), 0)
      }
    }
    this.dragStartCallback();
  }

  private dragEnd = (): void => {
    if (this.dragging) {
      this.dargEndCallback(this.dragging);
      this.dragging.removeClass(classes.dragging!);
      this.dragging = null;
    }
  }

  public clearFixElements(): void {
    this.fixElements = [];
  }

  public resize(width: number, height: number): void {
    this.fixElements.forEach((line) => {
      const countElement = line.length;
      const widthElement = Math.round(width / countElement) + countElement * 0.1;
      line.forEach((block) => {
        const blockElement = block.getElement();
        blockElement.style.width = `${widthElement}px`;
        blockElement.style.height = `${height}px`;
        blockElement.style.maskSize = `${widthElement}px ${height}px`;
      });
    });
    const elementCount = this.elements.length;
    const widthElement = Math.round(width / elementCount) + elementCount * 0.1;
    this.elements.forEach((block) => {
      const blockElement = block.getElement();
      blockElement.style.width = `${widthElement}px`;
      blockElement.style.height = `${height}px`;
      blockElement.style.maskSize = `${widthElement}px ${height}px`;
    });
  }
}