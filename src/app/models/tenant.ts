export class Tenant {
    constructor(
        public id: number,
        public fk: number, //landlord id
        public name: string,
        public phoneNumber: string,
        public email: string
    ) {}
}
