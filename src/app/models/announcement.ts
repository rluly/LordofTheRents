export class Announcement {
    constructor(
        public id: number | null,
        public subject: string,
        public message: string,
        public date: string,
        public time: string,
        public tenantIsActive?: boolean | null,
        public landlordIsActive?: boolean | null,
        public active?: boolean | null
    ){
    }
}
