import React, { useEffect, useState, useRef } from "react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import Users from "../Assests/Images/multiples-users.svg";
import Study from "../Assests/Images/study.svg";
import Filter from "../Assests/Images/filter.png";
import CommonService from "../Services/Common/CommonService";
import DataTable from "react-data-table-component";
import ChildTable from "../Components/ChildTable";

const UserStudies = () => {
  const [userStudies, setUserStudies] = useState([]);

  const loadUserstudies = async () => {
    const response = await CommonService.GetAllUserStudy();
    if (response.success) {
      setUserStudies(response.data);
    }
  };

  useEffect(() => {
    loadUserstudies();
  }, []);

  const columns = [
    {
      name: "Study Guid",
      selector: "Guid",
      sortable: false,
    },
    {
      name: "User Full Name",
      selector: "FullName",
      sortable: true,
    },
    {
      name: "User Name",
      selector: "UserName",
      sortable: true,
    },
    {
      name: "Total No.Of Answer",
      selector: "Data.length",
      sortable: true,
    },
  ];

  const childColumns = [
    {
      name: "File Name",
      selector: "FileName",
      sortable: true,
    },
    {
      name: "Rate",
      selector: "Rate",
      sortable: true,
    },
    {
      name: "Create On",
      selector: "CreatedOn",
      sortable: true,
    },
  ];

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
                title="Users Studies Data"
                paginationRowsPerPageOptions={[25, 50, 75, 100]}
                columns={columns}
                data={userStudies}
                expandableRows
                expandableRowsComponent={({ data }) => (
                  <ChildTable data={data.Data} columns={childColumns} />
                )}
                expandOnRowClicked
                pagination
                defaultSortAsc={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserStudies;
