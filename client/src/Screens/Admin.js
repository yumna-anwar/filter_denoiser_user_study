import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import Users from "../Assests/Images/multiples-users.svg";
import Study from "../Assests/Images/study.svg";
import Filter from "../Assests/Images/filter.png";
import CommonService from "../Services/Common/CommonService";
import DataTable from "react-data-table-component";

const Admin = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const response = await CommonService.GetAllUsers();
    if (response.success) {
      setUsers(response.data);
    }
  };

  const columns = [
    {
      name: "Id",
      selector: "Id",
      sortable: false,
    },
    {
      name: "Full Name",
      selector: "FullName",
      sortable: true,
    },
    {
      name: "User Name",
      selector: "UserName",
      sortable: true,
    },
    {
      name: "User Age",
      selector: "Age",
      sortable: true,
    },
    {
      name: "User Gender",
      selector: "Gender",
      sortable: true,
    },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Header showHomeBtn={true} />
      <div className="inner-layout">
        <div class="container-fluid">
          <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 navbar-light">
              <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white custom-sidebar pt-4">
                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100">
                  <li class="nav-item">
                    <Link to={"/admin"}>
                      <img src={Users} loading="lazy" />
                      Users
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link to={"/admin/user-studies"}>
                      <img src={Study} loading="lazy" />
                      Users Studies
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link to={"/admin/filter-A"}>
                      <img src={Filter} loading="lazy" />
                      Filter: Pinna Effect
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link to={"/admin/filter-B"}>
                      <img src={Filter} loading="lazy" />
                      Filter: Vent Effect
                    </Link>
                    </li>
                  <li class="nav-item">
                    <Link to={"/admin/filter-C"}>
                      <img src={Filter} loading="lazy" />
                      Filter: Insertion Loss
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link to={"/admin/user-gains"}>
                      <img src={Filter} loading="lazy" />
                      User HA Configurations
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col p-3">
              <DataTable
                title="Users Data"
                columns={columns}
                data={users}
                pagination
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
