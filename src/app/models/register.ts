export class Register {
  constructor(
    public id: string | null,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public phoneNumber: number,
    public landlordId: number | null
  ) {}
}
