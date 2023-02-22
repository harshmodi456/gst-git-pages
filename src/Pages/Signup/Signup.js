import React from 'react';
import './Signup.css'
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Signup() {

  const signupHandler = (values) => {
    console.log(values)
  }

  return (
    <div className='signup-container d-flex align-items-center'>
      <Formik
        initialValues={{ gstin: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
          gstin: Yup.string()
            .min(15)
            .max(15)
            .required('Required.'),
          password: Yup.string()
            .required('No password provided.'),
            // .min(8, 'Password is too short - should be 8 chars minimum.')
            // .max(20, 'Password must be less then 20 characters.'),
          confirmPassword: Yup.string()
            .when("password", {
              is: (val) => (val && val.length > 0 ? true : false),
              then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Not matched !"
              ),
            })
            .required('Required')
        })}

        onSubmit={async (values) => {
          signupHandler(values);
        }}
      >
        <Form className='w-50 mx-auto m-5 p-5 border rounded'>
          <h2 className='mb-5'>Signup</h2>

          <div>
            <label htmlFor='gstin' className='font-weight-bold'>GST Number :</label>
            <Field className='form-control' name='gstin' type="text" />
            <div className='text-danger text-right mt-2'>
              <ErrorMessage name="gstin" />
            </div>
          </div>

          <div>
            <label htmlFor='password' className='font-weight-bold'>Password :</label>
            <Field className='form-control' name='password' type="password" />
            <div className='text-danger text-right mt-2'>
              <ErrorMessage name="password" />
            </div>
          </div>

          <div> 
            <label htmlFor='confirmPassword' className='font-weight-bold'>Confirm Password :</label>
            <Field className='form-control' name='confirmPassword' type="password" />
            <div className='text-danger text-right mt-2'>
              <ErrorMessage name="confirmPassword" />
            </div>
          </div>

          <div className='d-flex justify-content-between mt-4'>
            <Link to='/login'>Already have an account? Login</Link>
          </div>

          <div className='w-100'>
            <button type='submit' className='btn btn-success mx-auto d-block mt-5'>Login</button>
          </div>

        </Form>
      </Formik>
    </div>
  )
}