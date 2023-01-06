import PromoInterface from './../interfaces/promo.interface';

export default class PromoService {
  private storageKey = 'promo';
  private promoList: number[] = [];

  constructor() {
    this.promoList = this.getPromoFromLocalStrg();
  }
  findPromo(name: string, promoList: PromoInterface[]): PromoInterface | null {
    const promos = promoList.filter((x) => x.title === name);
    return promos.length ? promos[0] : null;
  }

  getPromoList(): PromoInterface[] {
    return [
      { id: 1, title: 'rs10', percent: 10 },
      { id: 2, title: 'rs20', percent: 20 },
      { id: 3, title: 'rs30', percent: 30 },
    ];
  }
  private getPromoFromLocalStrg(): number[] {
    const promoStrgJson = localStorage.getItem(this.storageKey);
    const promo: number[] = promoStrgJson ? JSON.parse(promoStrgJson) : [];
    return promo;
  }

  private savePromoToLocalStrg(): void {
    const promoJson: number[] = [];
    this.promoList.forEach((value) => {
      promoJson.push(value);
    });
    localStorage.setItem('promo', JSON.stringify(promoJson));
    window.dispatchEvent(new CustomEvent('promolistchanged'));
  }

  addPromoToSelected(promoId: number): void {
    this.promoList.push(promoId);
    this.savePromoToLocalStrg();
  }

  deletePromoFromSelected(promoId: number) {
    this.promoList = this.promoList.filter((x) => x !== promoId);
    this.savePromoToLocalStrg();
  }

  getSelectedPromoList(): PromoInterface[] {
    return this.getPromoList().filter((x) => this.promoList.includes(x.id));
  }
  
  cleanSavedPromo(){
    this.promoList=[];
    this.savePromoToLocalStrg();
  }
}
