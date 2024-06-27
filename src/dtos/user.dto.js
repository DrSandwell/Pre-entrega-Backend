class UserDTO {
    constructor({ firstName, lastName, email, age, role }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.age = age;
        this.role = role;
    }
}

module.exports = UserDTO;
