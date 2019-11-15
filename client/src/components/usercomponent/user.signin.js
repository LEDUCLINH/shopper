import React, { Component } from 'react';
import axios from 'axios';

export class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:"",
            email:"",
            password:"",
            errors: {},
            register: false,
            notification: '',
            avatar: null,
            nameAvatar: ''
        }
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeAvatar = this.onChangeAvatar.bind(this);
    }
    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }
    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }
    onChangeName(e){
        this.setState({
            name: e.target.value
        })
    }
    onChangeAvatar(e) {
        console.log(e.target);
        this.setState({
            avatar: e.target.files[0],
            nameAvatar: e.target.files[0].name
        })
    }
    
    onSubmit(e){
        e.preventDefault();
        const formData = new FormData();
            formData.append("avatar", this.state.avatar);
            formData.append("name", this.state.name);
            formData.append("email", this.state.email);
            formData.append("password", this.state.password)
        // const user = {
        //     name: this.state.name,
        //     email: this.state.email,
        //     password: this.state.password,
        //     formData
        // }
        axios.post('http://localhost:4000/user/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            this.setState({
                name:'',
                email:'',
                password:'',
                register: true,
                notification: res.data.notification           
            })  
        })
        .catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                this.setState({
                    errors: error.response.data,
                    password: ''
                })
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
    
        });
    
    }
    render() {
            const errors = this.state.errors.errors; //one a array of some object
            var errName = '';
            var errEmail = '';
            var errPassword = '';
            for (let index in errors)
                 switch(errors[index].param){
                     case 'name':  errName = errors[index].msg;
                     break;
                     case 'email':  errEmail = errors[index].msg;
                     break;
                     case 'password':  errPassword = errors[index].msg;
                     break;
                     default: break;
             }
        return ( 
      <React.Fragment> 
      {!(this.state.register || localStorage.getItem('login')) &&  <div>
          <a href="#" id="resgister" data-toggle="modal" data-target="#exampleModal1">
                <i className="fa fa-user" aria-hidden="true"><span>Register</span></i>
            </a>
            <div className="modal fade" id="exampleModal1" tabIndex="0" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Register</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.onSubmit} encType="multipart/form-data">
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label">UserName</label>
                                    { errName && <p id="errRegister">{errName}</p>}
                                    <input  type="text" name="name" className="form-control" id="username" 
                                     value={this.state.name}
                                    onChange={this.onChangeName}
                                    required />
                                </div>
                                <div className="form-group">
                                <label htmlFor="userpassword" className="col-form-label">Password</label>
                                { errPassword && <p id="errRegister">{ errPassword }</p>}
                                    <input  type="password" name="password" className="form-control" id="userpassword"
                                     value={this.state.password}
                                    onChange={this.onChangePassword}
                                     required /> 
                                </div>
                                <div className="form-group">
                                <label htmlFor="useremail" className="col-form-label">Email</label>
                                { errEmail && <p id="errRegister">{errEmail}</p>}
                                    <input  type="email" name="email" className="form-control" id="useremail" required
                                     value={this.state.email}
                                    onChange={this.onChangeEmail}
                                     /> 
                                </div>
                                <div className="form-group">
                                <input type="file" name="avatar" style={{marginBottom:10}}
                                    onChange={this.onChangeAvatar}
                                    title="Chọn ảnh đại diện"
                                    style={{display: 'none'}}
                                    id="img"
                                    accept="image/png, image/jpeg"
                                />
                                <label for="img" className="btn btn-primary" style={{cursor:'pointer'}}>{this.state.nameAvatar ? this.state.nameAvatar :'Click me to upload image'}</label>
                                </div>
                                <button type="submit" id="register__submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                         <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>         
                         </div>
                    </div>
                 </div>
             </div> </div>}
     
             </React.Fragment>
                
     
        );
    }
}

export default Register;
