import React, { Component, Fragment } from 'react';
import CustomAlert from '../Alert/Alert';

import { LOGIN_LINK } from '../../configuration';
import avatar from './avatar.png';

import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			logged: false,
			openModal: false,  
			showAlert: false,
			alertTitle: '',
			alertMsg: '',
			alertType: "success" //success, error, question
		};
	}	

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		this.setState({ loadingLogin: true });

		if (this.checkInputs()) {
			this.checkUser();			
		} else {
			this.setState({ loadingLogin: false }, () => {
				this.displayAlert("Error", "Username and Password are both required fields", "error");
			});
		}
	};	

	// To check valid credentials and empty fields
	checkInputs() {
		return this.state.username && this.state.pass;
	}

	closeAlert = () => {
		this.setState({ showAlert: false })
	}

	// To check valid credentials
	async checkUser() {
		const config = {
			headers: {
				"Content-Type": "application/json",
			}
		}

		axios.post(LOGIN_LINK, {
			Code_User: document.getElementById('username').value.trim(),
			Password: document.getElementById('pass').value.trim()
		}, config)
		.then(({data: user}) => {
			if (user) {				
				localStorage.setItem('CodeUser', user.Code_User);
				localStorage.setItem('FullName', user.Full_Name);
				localStorage.setItem('Token', user.Token);
				localStorage.setItem('IdRoles', user.Id_Roles);
				localStorage.setItem("Id_Entity", user.Id_Entity);	
				
				this.setState({ logged: true });
			} else {
				localStorage.clear();
				this.setState({ loadingLogin: false, logged: false }, () => {
					this.displayAlert("Error", "Invalid Username or Password", "error");					
				});
			}
		})
		.catch(() => {
			this.setState({ loadingLogin: false, logged: false }, () => {
				this.displayAlert("Error", "Invalid Username or Password", "error");				
			});
		});
	}

	handleChange = ({target: {name, value, type, checked}}) => {
		this.setState({ [name]: type === "checkbox" ? checked : value});
	}

	displayAlert = (title, text, type) => {
		this.setState(() => ({
            showAlert: true,
            alertTitle: title,
            alertMsg: text,
            alertType: type
        }));
    }

	render() {
		if (this.state.logged) {
			return (
				<Redirect
					to="/kiosk"
				/>
			);
		}

		return (
			<Fragment>		
				<CustomAlert 
					show={this.state.showAlert}
					title={this.state.alertTitle}
					text={this.state.alertMsg}
					type={this.state.alertType}
					onConfirm={this.closeAlert}
				/>		
				<div className="Login">				
					<div className="container">
						<div className="row">
							<div className="col-12">
								<form className="Login-form" onSubmit={this.handleSubmit}>
									<div className="Login-avatar">
										<img src={avatar} className="img-fluid" alt="Avatar" />
									</div>
									<h2 className="text-center Login-title">Member Login</h2>
									<div className="form-group">
										<input
											className="form-control"
											type="text"
											id="username"
											name="username"
											placeholder="Type your username"
											required="required"
											onChange={this.handleChange}
											/>
									</div>
									<div className="form-group">
										<input
											className="form-control"
											type="password"
											id="pass"
											name="pass"
											placeholder="Type your password"
											required="required"
											onChange={this.handleChange}
											/>
									</div>
									<div className="form-group">
										<button
											className="btn btn-success btn-block Login-submit"
											disabled={this.state.loadingLogin}										
											type="submit"
											>
											Sign in
											{this.state.loadingLogin && (<i className="fas fa-spinner fa-spin ml-2" />)}
										</button>

									</div>
									<div className="Login-options">
										<label className="Login-remember"><input type="checkbox" /> Remember me</label>
										<a href="/forgotpassword" className="forgot">Forgot Password?</a>
									</div>	
								</form>
							</div>
						</div>
					</div>
				</div>			
			</Fragment>
		);
    }	
}

export default Login;

