export class GetWasteTrack {
    deviceID: string = '-1';
    empCode: string = '';
    empName: string = '';
    inOutDate: Date = new Date();
    vehicleNo: string = '';
    mobileNo: string = '';
    vehileID: string = '-1';
    mm: number = -1;
    yy: number = -1;
    noOfTrip: number = -1;
    totalWeight: number = 0.0;
    /*
    rtWeight1: number = 0.0;
     rtWeight2: number = 0.0;
    rtWeight3: number = 0.0;
    rtWeight4: number = 0.0;
     rtWeight5: number = 0.0;
     rtWeight6: number = 0.0;
    rtWeight7: number = 0.0;
    rtWeight8: number = 0.0;
    public rTWeight9: number = 0.0;
    public rTWeight10: number = 0.0;
    rTWeight11: number = 0.0;
    rTWeight12: number = 0.0;
    public RTWeight13: number = 0.0;
    public RTWeight14: number = 0.0;
    rTWeight15: number = 0.0;
    rTWeight16: number = 0.0;
    public RTWeight17: number = 0.0;
    public RTWeight18: number = 0.0;
    rTWeight19: number = 0.0;
    rTWeight20: number = 0.0;
    public RTWeight21: number = 0.0;
    public RTWeight22: number = 0.0;
    rTWeight23: number = 0.0;
    rTWeight24: number = 0.0;
    public RTWeight25: number = 0.0;
    */
    inTime1: Date = new Date();
    inTime2: Date = new Date();
    inTime3: Date = new Date();
    inTime4: Date = new Date();
    inTime5: Date = new Date();
    inTime6: Date = new Date();
    inTime7: Date = new Date();
    inTime8: Date = new Date();
    inTime9: Date = new Date();
    inTime10: Date = new Date();
    inTime11: Date = new Date();
    inTime12: Date = new Date();
    outTime1: Date = new Date();
    outTime2: Date = new Date();
    outTime3: Date = new Date();
    outTime4: Date = new Date();
    outTime5: Date = new Date();
    outTime6: Date = new Date();
    outTime7: Date = new Date();
    outTime8: Date = new Date();
    outTime9: Date = new Date();
    outTime10: Date = new Date();
    outTime11: Date = new Date();
    outTime12: Date = new Date();
    inWt1: number = 0.0;
    inWt2: number = 0.0;
    inWt3: number = 0.0;
    inWt4: number = 0.0;
    inWt5: number = 0.0;
    inWt6: number = 0.0;
    inWt7: number = 0.0;
    inWt8: number = 0.0;
    inWt9: number = 0.0;
    inWt10: number = 0.0;
    inWt11: number = 0.0;
    inWt12: number = 0.0;
    outWt1: number = 0.0;
    outWt2: number = 0.0;
    outWt3: number = 0.0;
    outWt4: number = 0.0;
    outWt5: number = 0.0;
    outWt6: number = 0.0;
    outWt7: number = 0.0;
    outWt8: number = 0.0;
    outWt9: number = 0.0;
    outWt10: number = 0.0;
    outWt11: number = 0.0;
    outWt12: number = 0.0;
    weight1: number = 0.0;
    weight2: number = 0.0;
    weight3: number = 0.0;
    weight4: number = 0.0;
    weight5: number = 0.0;
    weight6: number = 0.0;
    weight7: number = 0.0;
    weight8: number = 0.0;
    weight9: number = 0.0;
    weight10: number = 0.0;
    weight11: number = 0.0;
    weight12: number = 0.0;

}
export class GetWasteTrackList {
    result2: GetWasteTrack[] = [];
}

export class WasteSummary {
    vehileID: string = "";
    vehicleNo: string = "";
    totalNoOfTrip: number = 0;
    totalWeight: number = 0.0;
    fromDate: Date = new Date();
    toDate: Date = new Date();
}

export class WasteSummaryList {
    result1: WasteSummary[] = [];
    result2: GetWasteTrack[] = [];
    result3: WasteVehicleModel[] = [];
}
export class Type_RowReq {
    rowID: number = 0;
    rowValue: string = "";
}

export class GetWasteTrackReq {
    public fromDate: Date = new Date();
    public toDate: Date = new Date();
    lstType_RowReq: Type_RowReq[] = [];
    type: number = 1;
    pdfxls: string = "";
    detailSummary: string = "";
    show: boolean = false;
}
FromDate: new Date();
ToDate: new Date();
export class VehicleRfid {
    vehileID: any = 0;
    vehicleNo: string = "";
    deviceName: string = "";
    deviceName2: string = "";
    select: boolean = false;
}

export class VehicleAllDetails {
    VehileID: any = 0;
    VehileName: string = "";
    VehileCode: string = "";
    VehileCatID: string = "";
    VehileTypeI: string = "";
    DeviceID: string = "";
    PurchaseYear: string = "";
    ModelNo: string = "";
    SerialNo: string = "";
    VehicleNo: string = "";
    ChesisNo: string = "";
    VehicleEmptyWeight: string = "";
    VehImage: string = "";
    
}
export class VehicleRfidList {
    result: VehicleRfid[] = [];
}

export class WasteVehicleModel {
    scrapVisitID: string = "";
    vehicleNo: string = "";
    empName: string = "";
    mobileNo: string = "";
    inTime: Date = new Date();
    outTime: Date = new Date();
    inOutTime: Date = new Date();
    inWt: number = 0;
    outWt: number = 0;
    weight: number = 0;
    vehicleWeight: number = 0;
    iMageStr: string = "";
}

export class WasteVehicleModelList {
    result: WasteVehicleModel[] = [];
}
export class WeightChart{
    sDate:string="";
    weight:number=0;
    nooftrip:number=0;
  }