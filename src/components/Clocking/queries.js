

export const FETCH_SHIFTS_ORDERED = `
    query employeesWSSN($idEntity: Int!) {
        employeesWSSN(idEntity: $idEntity) {
            id
            idEntity
            Application {
                pin
                firstName
                middleName
                lastName
                Urlphoto
            }  
            positions{
                id
                name
            }          
        }
    }
`;

export const FETCH_MARKET_TYPES = `
    {
        getcatalogitem(Id_Catalog: 18){
            Id
            Description
        }
    }
`;

export const GET_USERS_QUERY = `
	query getvalid_users($Code_User: String, $Password: String) {
		getvalid_users(Code_User: $Code_User, Password: $Password) {
			Id
			Code_User
			Full_Name
			Electronic_Address
			Phone_Number
			Id_Language
			IsAdmin
			AllowEdit
			AllowDelete
			AllowInsert
			AllowExport
			IsActive
			Token
		}
	}
`;

export const GET_CURRENT_MARKS = `
    query lastMarks($employeeId:Int, $entityId:Int){
        punchesByCurrentDate(EmployeeId:$employeeId, entityId:$entityId){
            id
            time    
        }
    }
`;

export const GET_OPEN_CLOCKIN = `
  query clockinIsOpen($employeeId:Int, $entityId:Int){
    clockinIsOpen(entityId:$entityId, EmployeeId:$employeeId) {
      isOpen
      positionId
    }
  }
`