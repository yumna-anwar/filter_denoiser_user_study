import React, { useEffect, useState, useRef } from "react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import Users from "../Assests/Images/multiples-users.svg";
import Study from "../Assests/Images/study.svg";
import Filter from "../Assests/Images/filter.png";
import CommonService from "../Services/Common/CommonService";
import DataTable from "react-data-table-component";
import ChildTable from "../Components/ChildTable";

const FiltersA = () => {
  const [filters, setFilters] = useState([]);

  const loadFilters = async () => {
    const response = await CommonService.GetFilterA();
    if (response.success) {
      setFilters(response.data);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const columns = [
    {
      name: "Id",
      selector: "sno",
      sortable: false,
    },
    {
      name: "Date",
      selector: "date",
      sortable: false,
    },
    {
      name: "User Id",
      selector: "UserId",
      sortable: true,
    },
    {
      name: "Step",
      selector: "step",
      sortable: true,
    },
    {
      name: "Volume",
      selector: "volume",
      sortable: true,
    },
    {
      name: "200 hz Right",
      selector: "R200hz",
      sortable: true,
    },
    {
      name: "500 hz Right",
      selector: "R500hz",
      sortable: true,
    },
    {
      name: "1K hz Right",
      selector: "R1000hz",
      sortable: true,
    },
    {
      name: "2K hz Right",
      selector: "R2000hz",
      sortable: true,
    },
    {
      name: "3K hz Right",
      selector: "R3000hz",
      sortable: true,
    },
    {
      name: "4K hz Right",
      selector: "R4000hz",
      sortable: true,
    },
    {
      name: "6K hz Right",
      selector: "R6000hz",
      sortable: true,
    },
    {
      name: "8K hz Right",
      selector: "R8000hz",
      sortable: true,
    },
    {
      name: "200 hz Left",
      selector: "L200hz",
      sortable: true,
    },
    {
      name: "500 hz Left",
      selector: "L500hz",
      sortable: true,
    },
    {
      name: "1K hz Left",
      selector: "L1000hz",
      sortable: true,
    },
    {
      name: "2K hz Left",
      selector: "L2000hz",
      sortable: true,
    },
    {
      name: "3K hz Left",
      selector: "L3000hz",
      sortable: true,
    },
    {
      name: "4K hz Left",
      selector: "L4000hz",
      sortable: true,
    },
    {
      name: "6K hz Left",
      selector: "L6000hz",
      sortable: true,
    },
    {
      name: "8K hz Left",
      selector: "L8000hz",
      sortable: true,
    },
    {
      name: "Gain table",
      selector: "gtable",
      sortable: true,
    }
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
            <div class="col p-3 overflow-x-auto">
              <DataTable
                title="Filter A: Pinna Effect"
                columns={columns}
                data={filters}
                pagination
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersA;
