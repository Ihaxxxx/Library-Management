import {Routes, Route } from 'react-router-dom'
import LoginPage from '../src/pages/LoginPage'
import RegisterAdminPage from '../src/pages/RegisterAdminPage'
import Books from './pages/Books'
import AddCustomer from './pages/AddCustomer'
import IssueBook from './pages/IssueBook'
import ReturnBook from './pages/Return Book'
import ReIssue from './pages/ReIssue'
import IssueBookWithId from './pages/IssueBookWithId'
import Home from './pages/Home'
import Users from './pages/Users'
import UserDetails from './pages/UserDetails'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/registeradmin' element={<RegisterAdminPage/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/books' element={<Books/>} />
        <Route path='/addcustomer' element={<AddCustomer/>} />
        <Route path='/addcustomer' element={<AddCustomer/>} />
        <Route path='/issuebook' element={<IssueBook/>} />
        <Route path='/issuebook/:bookid' element={<IssueBookWithId/>} />
        <Route path='/returnbook' element={<ReturnBook/>} />
        <Route path='/reissue' element={<ReIssue/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/users/:userid' element={<UserDetails/>} />
      </Routes>
    </>
  )
}

export default App
