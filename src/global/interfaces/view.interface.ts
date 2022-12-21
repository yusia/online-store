export default interface View {
  loadContent(rootElem: string, params: (string | number)[]): void;
}