export interface LinkedUsersResType {
  draw: string;
  recordsTotal: number;
  isLoadTotal: boolean;
  data: {
    [key: string]: {
      Value: string;
      DataType?: number;
      IsTime?: number;
      ObjID: string;
      ParamID?: string;
      Color: string;
      u: string;
      rid: string;
      rv: string;
      ChID: number;
      lv: number;
      PrID?: string;
      tooltip: string;
      cu: string;
      ObjTypeID: number;
      Hide: boolean;
      LastLv: number;
      isArray: number;
    };
  }[];
  MinMaxData: [];
  Result: number;
  getOnlyTotal: string;
  dataAssociation: [];
  allCountAssociation?: number;
}

export interface AllLinkedUsersRes {
  TreeContent: TreeContent[];
  Buttons: object;
  InterfaceID: string;
  ParallelInterfaceID?: number;
  RealInterfaceID: number;
  Name: string;
  LinkToAnotherTab?: any;
  ObjTypeID: number;
  CalcParamID: string;
  HaveLinkedTables: number;
  HaveOnlyEditParam: number;
  ObjID: string;
  UseCamera: number;
  IsTemplate: number;
  HelpLink?: string;
}

export interface TreeContent {
  DisplayModeForSideFilter?: string;
  ExternalInterfaceID?: number;
  ExternalTabID?: number;
  FileArray: any[]; // Замените any на более конкретный тип данных, если это возможно
  FilterByUserID: number;
  Folder: any[]; // Замените any на более конкретный тип данных, если это возможно
  Formula: string;
  GroupID: number;
  HasChild: number;
  HaveNotOnlyEditParam0: number;
  HaveParams: number;
  HelpLink?: string;
  Horizontal?: string;
  InnerChart: {
    Chart: any[]; // Замените any на более конкретный тип данных, если это возможно
    IdObj: string;
  };
  InterfaceIDAdd?: number;
  LinkPrew?: string;
  Name: string;
  ObjTypeID?: number;
  ObjTypeIDViewSelect?: number;
  ParamID?: number;
  ParamsDATA: any[]; // Замените any на более конкретный тип данных, если это возможно
  ParamsForSideFilter?: any[]; // Замените any на более конкретный тип данных, если это возможно
  ParamsHTML: string;
  Preview?: string;
  Settings: {
    [key: string]: string;
  };
  TabType: number;
  Table: number;
  Tables: any[]; // Замените any на более конкретный тип данных, если это возможно
  TypeForSideFilterParam?: any[]; // Замените any на более конкретный тип данных, если это возможно
  TypeID: number;
  TypesForSideFilter?: any[]; // Замените any на более конкретный тип данных, если это возможно
  ViewMode?: string;
  children: boolean;
  isFil: boolean;
}

export interface UsersForManagersRes {
  draw: string;
  recordsTotal: number;
  isLoadTotal: boolean;
  data: UserData[];
  MinMaxData: any[]; // Здесь типы данных для MinMaxData могут быть дополнительно уточнены
  Result: number;
  getOnlyTotal: string;
  dataAssociation: any[]; // Здесь типы данных для dataAssociation могут быть дополнительно уточнены
  allCountAssociation: any | null; // Здесь типы данных для allCountAssociation могут быть дополнительно уточнены
}

interface UserData {
  [key: string]: UserProperty;
}

interface UserProperty {
  Value: string;
  DataType: number;
  IsTime: number | null;
  ObjID: number;
  ParamID: string;
  Color: string;
  u: string;
  rid: string;
  rv: string;
  ChID: number;
  lv: number;
  PrID: number | null;
  tooltip: string;
  cu: string;
  ObjTypeID: number;
  Hide: boolean;
  LastLv: number;
  isArray: number;
}
