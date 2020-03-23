

export const ADD_CHECKS = `
    mutation MarkedEmployees($MarkedEmployees: [InputMarkedEmployeeType]) {
        addMarkedEmployees(MarkedEmployees:$MarkedEmployees) {
            id
            entityId
            typeMarkedId
            markedDate
            markedTime
            EmployeeId
            key
        }
    }
`;

export const ADD_MARK = `
mutation addSingleMark($mark:InputMarkedEmployeeType){
    addSingleMark(mark:$mark)
}
`;