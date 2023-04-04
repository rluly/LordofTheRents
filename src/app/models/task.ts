export class Task {
    id: number = 0;
    landlordId: number = 0;
    datetime: Date = new Date();

    constructor(
        public task: string, 
        public time: string, 
        public date: string, 
        public active: boolean
    ) {
    };

}
