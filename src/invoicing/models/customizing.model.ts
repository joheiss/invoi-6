export interface CustomizingHeaderData {
  $id?: string;
  id?: string;
}

export abstract class Customizing {

  abstract header?: CustomizingHeaderData;
}
