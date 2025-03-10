import React from "react";
import withNavigate from "../hooks/withNavigate";
import Cookies from "js-cookie";
import MotorVehicle from "../components/motorVehicles";
import Property from "../components/properties";
import Cash from "../components/cash";
import Company from "../components/companyOwnership";
import ShortTermLoan from "../components/shortTermLoans";
import PersonalLoan from "../components/personalLoans";
import LifestyleExpense from "../components/lifestyleExpenses";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
//import styles
import backgroundImage from "./../../public/assets/images/manSigningDocuments.jpg"; // Import the image
import plus from "./../../public/assets/images/plus.svg"; // Import the icon
import trash from "./../../public/assets/images/trash.svg"; // Import the icon
import arrow from "./../../public/assets/images/angle-small-down.svg"; // Import the icon

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      SAID: "",
      email: "",
      totalAssets: 0,
      totalLiabilities: 0,
      isEditing: false, // State to manage edit mode

      // Add more assets liabilities variables
      primaryResidence: [
        {
          address: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          householdContentsValue: "",
          benificiary_BequethedTo: "",
        },
      ],
      motorVehicles: [
        {
          model: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
      properties: [
        {
          type: "",
          adress: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
      cashAccounts: [
        {
          assetValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
      companies: [
        {
          name: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
      shortTermLoans: [
        {
          type: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
      personalLoans: [
        {
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
      lifestyleExpenses: [
        {
          type: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],

      //accordion state management
      showMotorVehicles: false,
      showProperties: false,
      showPrimaryResidence: false,
      showCashAccounts: false,
      showCompanies: false,
      showShortTermLoans: false,
      showPersonalLoans: false,
      showLifestyleExpenses: false,
    };
  }

  componentDidMount() {
    this.checkLoginStatus();
    this.fetchUserData(); 
  }
  
  fetchUserData = async () => {
    try {
      // Get the email from cookies
      let email = Cookies.get("email");
      console.log(email);
  
      // Make a GET request to retrieve user data
      const response = await fetch(`/.netlify/functions/profile${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response); 
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse the response data
      const data = await response.json();
      console.log('User data retrieved:', data);
  
      // Calculate total assets and total liabilities
      const calculateTotal = (items, key) => {
        return items.reduce((total, item) => {
          const value = parseFloat(item[key]) || 0;
          return total + value;
        }, 0);
      };
  
      const totalAssets = calculateTotal(data.primaryResidence || [], 'assetValue') +
                          calculateTotal(data.motorVehicles || [], 'assetValue') +
                          calculateTotal(data.properties || [], 'assetValue') +
                          calculateTotal(data.cashAccounts || [], 'assetValue') +
                          calculateTotal(data.companies || [], 'assetValue');
  
      const totalLiabilities = calculateTotal(data.primaryResidence || [], 'liabilityValue') +
                               calculateTotal(data.motorVehicles || [], 'liabilityValue') +
                               calculateTotal(data.properties || [], 'liabilityValue') +
                               calculateTotal(data.shortTermLoans || [], 'liabilityValue') +
                               calculateTotal(data.personalLoans || [], 'liabilityValue') +
                               calculateTotal(data.lifestyleExpenses || [], 'liabilityValue');
  
      // Update the state with the retrieved data and calculated totals
      this.setState({
        firstName: data.firstName,
        lastName: data.lastName,
        primaryResidence: data.primaryResidence && data.primaryResidence.length > 0 ? data.primaryResidence : [{
          address: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          householdContentsValue: "",
          benificiary_BequethedTo: "",
        }],
        motorVehicles: data.motorVehicles || [],
        properties: data.properties || [],
        cashAccounts: data.cashAccounts || [],
        companies: data.companies || [],
        shortTermLoans: data.shortTermLoans || [],
        personalLoans: data.personalLoans || [],
        lifestyleExpenses: data.lifestyleExpenses || [],
        totalAssets,
        totalLiabilities,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to retrieve user data. Please try again.');
    }
  };

  checkLoginStatus = async () => {
    const loggedIn = Cookies.get("LoggedIn");
    if (!loggedIn) {
      alert("Session has expired");
      this.props.navigate("/Login");
    }
  };

  toggleEditMode = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  };

  saveChanges = async () => {
    // Log the current state
    console.log("this state:", this.state);
  
    // Get the email from cookies
    let email = Cookies.get("email");
    console.log(email);
  
    try {
      // Use the root '/api/updateUserInfo' to update the user's information
      const response = await fetch('/.netlify/functions/updateUserInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          primaryResidence: this.state.primaryResidence,
          motorVehicles: this.state.motorVehicles,
          properties: this.state.properties,
          cashAccounts: this.state.cashAccounts,
          companies: this.state.companies,
          shortTermLoans: this.state.shortTermLoans,
          personalLoans: this.state.personalLoans,
          lifestyleExpenses: this.state.lifestyleExpenses,
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse the response data
      const data = await response.json();
      console.log('Success:', data);
  
      // Recalculate total assets and total liabilities
      const calculateTotal = (items, key) => {
        return items.reduce((total, item) => {
          const value = parseFloat(item[key]) || 0;
          return total + value;
        }, 0);
      };
  
      const totalAssets = calculateTotal(this.state.primaryResidence || [], 'assetValue') +
                          calculateTotal(this.state.motorVehicles || [], 'assetValue') +
                          calculateTotal(this.state.properties || [], 'assetValue') +
                          calculateTotal(this.state.cashAccounts || [], 'assetValue') +
                          calculateTotal(this.state.companies || [], 'assetValue');
  
      const totalLiabilities = calculateTotal(this.state.primaryResidence || [], 'liabilityValue') +
                               calculateTotal(this.state.motorVehicles || [], 'liabilityValue') +
                               calculateTotal(this.state.properties || [], 'liabilityValue') +
                               calculateTotal(this.state.shortTermLoans || [], 'liabilityValue') +
                               calculateTotal(this.state.personalLoans || [], 'liabilityValue') +
                               calculateTotal(this.state.lifestyleExpenses || [], 'liabilityValue');
  
      // Update the state with the recalculated totals
      this.setState({
        totalAssets,
        totalLiabilities,
      });
  
      // Toggle edit mode off
      this.toggleEditMode();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  cancelEdit = () => {
    // Implement cancel functionality here
    this.toggleEditMode();
  };

  handleChange = (event, section, index) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
      const updatedSection = [...prevState[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        [name]: value,
      };
      return { [section]: updatedSection };
    });
  };

  //primary residence functions
  togglePrimaryResidence = () => {
    this.setState((prevState) => ({
      showPrimaryResidence: !prevState.showPrimaryResidence,
    }));
  };

  //motorvehicles functions
  handleChangeVehicle = (event, index) => {
    const { name, value } = event.target;
    const motorVehicles = [...this.state.motorVehicles];
    motorVehicles[index][name.split("-")[0]] = value;
    this.setState({ motorVehicles });
  };

  handleAddVehicle = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      motorVehicles: [
        ...prevState.motorVehicles,
        {
          model: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
    }));
  };

  handleRemoveVehicle = (index) => {
    event.preventDefault();
    this.setState((prevState) => ({
      motorVehicles: prevState.motorVehicles.filter((_, i) => i !== index),
    }));
  };

  toggleMotorVehicles = () => {
    this.setState((prevState) => ({
      showMotorVehicles: !prevState.showMotorVehicles,
    }));
  };

  //properties functions
  toggleProperties = () => {
    this.setState((prevState) => ({
      showProperties: !prevState.showProperties,
    }));
  };

  handleChangeProperty = (event, index) => {
    const { name, value } = event.target;
    const properties = [...this.state.properties];
    properties[index][name.split("-")[0]] = value;
    this.setState({ properties });
  };

  handleAddProperty = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      properties: [
        ...prevState.properties,
        {
          type: "",
          address: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
    }));
  };

  handleRemoveProperty = (index) => {
    event.preventDefault();
    this.setState((prevState) => ({
      properties: prevState.properties.filter((_, i) => i !== index),
    }));
  };

  //cash functions
  toggleCashAccounts = () => {
    this.setState((prevState) => ({
      showCashAccounts: !prevState.showCashAccounts,
    }));
  };

  handleChangeCash = (event, index) => {
    const { name, value } = event.target;
    const cashAccounts = [...this.state.cashAccounts];
    cashAccounts[index][name.split("-")[0]] = value;
    this.setState({ cashAccounts });
  };

  handleAddCash = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      cashAccounts: [
        ...prevState.cashAccounts,
        { assetValue: "", bankName: "", benificiary_BequethedTo: "" },
      ],
    }));
  };

  handleRemoveCash = (index) => {
    this.setState((prevState) => ({
      cashAccounts: prevState.cashAccounts.filter((_, i) => i !== index),
    }));
  };

  //company functions
  toggleCompanies = () => {
    this.setState((prevState) => ({
      showCompanies: !prevState.showCompanies,
    }));
  };

  handleChangeCompany = (event, index) => {
    const { name, value } = event.target;
    const companies = [...this.state.companies];
    companies[index][name.split("-")[0]] = value;
    this.setState({ companies });
  };

  handleAddCompany = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      companies: [
        ...prevState.companies,
        {
          name: "",
          assetValue: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
    }));
  };

  handleRemoveCompany = (index) => {
    this.setState((prevState) => ({
      companies: prevState.companies.filter((_, i) => i !== index),
    }));
  };

  //short term loan functions
  toggleShortTermLoans = () => {
    this.setState((prevState) => ({
      showShortTermLoans: !prevState.showShortTermLoans,
    }));
  };

  handleChangeShortTermLoan = (event, index) => {
    const { name, value } = event.target;
    const shortTermLoans = [...this.state.shortTermLoans];
    shortTermLoans[index][name.split("-")[0]] = value;
    this.setState({ shortTermLoans });
  };

  handleAddShortTermLoan = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      shortTermLoans: [
        ...prevState.shortTermLoans,
        {
          type: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
    }));
  };

  handleRemoveShortTermLoan = (index) => {
    this.setState((prevState) => ({
      shortTermLoans: prevState.shortTermLoans.filter((_, i) => i !== index),
    }));
  };

  //personal loan functions

  togglePersonalLoans = () => {
    this.setState((prevState) => ({
      showPersonalLoans: !prevState.showPersonalLoans,
    }));
  };

  handleChangePersonalLoan = (event, index) => {
    const { name, value } = event.target;
    const personalLoans = [...this.state.personalLoans];
    personalLoans[index][name.split("-")[0]] = value;
    this.setState({ personalLoans });
  };

  handleAddPersonalLoan = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      personalLoans: [
        ...prevState.personalLoans,
        { liabilityValue: "", bankName: "", benificiary_BequethedTo: "" },
      ],
    }));
  };

  handleRemovePersonalLoan = (index) => {
    this.setState((prevState) => ({
      personalLoans: prevState.personalLoans.filter((_, i) => i !== index),
    }));
  };

  //lifestyle expenses functions

  toggleLifestyleExpenses = () => {
    this.setState((prevState) => ({
      showLifestyleExpenses: !prevState.showLifestyleExpenses,
    }));
  };

  handleChangeLifestyleExpense = (event, index) => {
    const { name, value } = event.target;
    const lifestyleExpenses = [...this.state.lifestyleExpenses];
    lifestyleExpenses[index][name.split("-")[0]] = value;
    this.setState({ lifestyleExpenses });
  };

  handleAddLifestyleExpense = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      lifestyleExpenses: [
        ...prevState.lifestyleExpenses,
        {
          type: "",
          liabilityValue: "",
          bankName: "",
          benificiary_BequethedTo: "",
        },
      ],
    }));
  };
  

  handleRemoveLifestyleExpense = (index) => {
    this.setState((prevState) => ({
      lifestyleExpenses: prevState.lifestyleExpenses.filter(
        (_, i) => i !== index
      ),
    }));
  };
  
  export = async () => {
    console.log("Exporting data...");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estate Liquidity Calculation');
    
    // Define columns
    worksheet.columns = [
      { header: 'Lifestyle Assets', key: 'lifestyleAsset', width: 30 },
      { header: 'Market Value', key: 'marketValue', width: 30},
      { header: '', key: 'space', width: 5},
      { header: 'Liability', key: 'liability', width: 30 },
      { header: 'Amount Outstanding', key: 'amountOutstanding', width: 30},
    ];
    
    const addProperty = (items) => {
      items.forEach(item => {
        worksheet.addRow({
          lifestyleAsset: item.address || '',
          marketValue: item.assetValue || '',
          liability: item.bankName || '',
          amountOutstanding: item.liabilityValue || '',
        });
      });
      worksheet.addRow({});
    };
  
    const addVehicle = (items) => {
      items.forEach(item => {
        worksheet.addRow({
          lifestyleAsset: item.model || '',
          marketValue: item.assetValue || '',
          liability: item.bankName || '',
          amountOutstanding: item.liabilityValue || '',
        });
      });
      worksheet.addRow({});
    };
  
    const addCash = (items) => {
      items.forEach(item => {
        worksheet.addRow({
          lifestyleAsset: item.bankName|| '',
          marketValue: item.assetValue || '',
        });
      });
      worksheet.addRow({});
    };

    const addCompany = (items) => {
      items.forEach(item => {
        worksheet.addRow({
          lifestyleAsset: item.name || '',
          marketValue: item.assetValue || '',
          liability: item.bankName || '',
          amountOutstanding: item.liabilityValue || '',
        });
      });
      worksheet.addRow({});
    };

    const addLoan = (items) => {
      items.forEach(item => {
        worksheet.addRow({
          liability: item.bankName || '',
          amountOutstanding: item.liabilityValue || '',
        });
      });
      worksheet.addRow({});
    };
    
    const addLifeExpenses = (items) => {
      items.forEach(item => {
        worksheet.addRow({
          liability: item.bankName || '',
          amountOutstanding: item.liabilityValue || '',
        });
      });
      worksheet.addRow({});
    }

  
    // Add rows for each category
    const primaryResidenceRow = worksheet.addRow({ lifestyleAsset: "Primary Residence" });
    primaryResidenceRow.font = { bold: true };

    addProperty(this.state.primaryResidence);
  
    const householdContentRow = worksheet.addRow({ lifestyleAsset: "Household Contents" });
    householdContentRow.font = { bold: true };
    worksheet.addRow({
      lifestyleAsset: this.state.primaryResidence[0].address,
      marketValue: this.state.primaryResidence[0].householdContentsValue,
    });
  
    const vehiclesRow = worksheet.addRow({ lifestyleAsset: "Motor Vehicles" });
    vehiclesRow.font = { bold: true };

    addVehicle(this.state.motorVehicles);
    
    //investment category
    const investmentRow = worksheet.addRow({lifestyleAsset: "Investments", marketValue: " ", space: " ", liability: "Long Term", amountOutstanding: " "}); 
    investmentRow.font = {bold: true}; 
    investmentRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
      };
    });

    const propertiesRow = worksheet.addRow({ lifestyleAsset: "Property", liability: "Mortgage Bond"});
    propertiesRow.font = { bold: true };

    addProperty(this.state.properties);
  
    const cashRow = worksheet.addRow({ lifestyleAsset: "Cash Accounts" });
    cashRow.font = { bold: true };

    addCash(this.state.cashAccounts);
  
    const companiesRow = worksheet.addRow({ lifestyleAsset: "Companies" });
    companiesRow.font = { bold: true };
  
    addCompany(this.state.companies,);
  
    const shortTermLoansRow = worksheet.addRow({ liability: "Short Term Loans" });
    shortTermLoansRow.font = { bold: true };
    addLoan(this.state.shortTermLoans);
  
    const personalLoansRow = worksheet.addRow({ liability: "Personal Loans" });
    personalLoansRow.font = { bold: true };
    addLoan(this.state.personalLoans);
  
    const lifestyleExpensesRow = worksheet.addRow({ liability: "Lifestyle Expenses" });
    lifestyleExpensesRow.font = { bold: true };

    addLifeExpenses(this.state.lifestyleExpenses);

    worksheet.spliceColumns(1, 0, 1); 
    worksheet.spliceRows(1, 0, 1);
    worksheet.getCell('B1').value = 'Estate Liquidity Calculation';
    worksheet.spliceRows(1, 0, 1);

    worksheet.getRow(2).font = { bold: true, size: 20};
    worksheet.getRow(3).font = { bold: true, size: 15};
    worksheet.getRow(3).eachCell((cell) => {
      cell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' },
      };
    });

    // Add thin border around the outside of all content below row 3
    const startRow = 4;
    const endRow = worksheet.lastRow.number;
    const startCol = 2;
    const endCol = worksheet.columns.length-1;

    for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
      const row = worksheet.getRow(rowNum);
      for (let colNum = startCol; colNum <= endCol; colNum++) {
        const cell = row.getCell(colNum);
        if (rowNum === startRow) {
          cell.border = { ...cell.border, top: { style: 'medium' } };
        }
        if (rowNum === endRow) {
          cell.border = { ...cell.border, bottom: { style: 'medium' } };
        }
        if (colNum === startCol) {
          cell.border = { ...cell.border, left: { style: 'medium' } };
        }
        if (colNum === endCol) {
          cell.border = { ...cell.border, right: { style: 'medium' } };
        }
        if (colNum === 4) {
          cell.border = { ...cell.border,right: { style: 'medium' } };
          cell.border = { ...cell.border,left: { style: 'medium' } };
        }
      }
    }
  
    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Estate_Liquidity_Calculation.xlsx');
  };
  
  render() {
    const {
      isEditing,
      motorVehicles,
      showMotorVehicles,
      properties,
      showProperties,
      showPrimaryResidence,
      cashAccounts,
      showCashAccounts,
      companies,
      showCompanies,
      shortTermLoans,
      showShortTermLoans,
      showPersonalLoans,
      personalLoans,
      lifestyleExpenses,
      showLifestyleExpenses,
    } = this.state;

    return (  
      <div className="relative flex flex-col justify-start items-center gap-2 box-border bg-myBlue-300 w-full h-[90vh] p-3">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="relative bg-white w-[87vw] h-[7vh] min-h-[7vh] flex flex-row justify-center items-center rounded-lg shadow-lg overflow-hidden box-border p-1">
          <div className=" flex flex-row justify-start items-center w-[50%] h-full rounded-l-lg">
            <p>
              {this.state.firstName} {this.state.lastName}
            </p>
          </div>
          <div className=" flex flex-row justify-center items-center w-[50%] h-full rounded-l-lg">
            <label>Assets=</label>
            <p>{this.state.totalAssets}</p>
          </div>
          <div className=" flex flex-row justify-center items-center w-[50%] h-full rounded-l-lg">
            <label>Liabilities=</label>
            <p>{this.state.totalLiabilities}</p>
          </div>
          <div className=" flex flex-row justify-center items-center w-[50%] h-full rounded-l-lg">
            <label>Net Worth=</label>
            <p>{this.state.totalAssets - this.state.totalLiabilities}</p>
          </div>
        </div>

        <div className="relative w-[87vw] h-[auto] min-h-[9vh] flex flex-row justify-end gap-4 items-center rounded-lg overflow-hidden p-1">
          {isEditing ? (
            <>
              <button onClick={this.saveChanges} id="save" className="button2">
                Save
              </button>
              <button onClick={this.cancelEdit} id="cancel" className="button2">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={this.toggleEditMode}
                id="editAssets"
                className="button2"
              >
                Edit
              </button>
              <button onClick={this.export} id="export" className="button2">
                Export
              </button>
            </>
          )}
        </div>

        {/* assets/liabilities form */}
        <div
          className={`relative bg-white w-[87vw] h-auto flex flex-col justify-start items-center rounded-lg   g overflow-auto p-2 ${
            !isEditing ? "opacity-70" : ""
          }`}
        >
          <form className="flex flex-col justify-start items-center gap-2 w-full">
            {/* Primary Residence */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer box-border flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.togglePrimaryResidence}
              >
                Primary Residence
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showPrimaryResidence ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showPrimaryResidence && (
                <div className="bg-white w-[80vwv] py-2 text-white rounded-lg flex flex-row justify-start gap-5 items-center box-border overflow-hidden">
                  <input
                    type="text"
                    name="address"
                    value={this.state.primaryResidence[0].address}
                    onChange={(e) => this.handleChange(e, 'primaryResidence', 0)}
                    placeholder="Address"
                    className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
                    disabled={!isEditing}
                  />
                  <input
                    type="number"
                    name="assetValue"
                    value={this.state.primaryResidence[0].assetValue}
                    onChange={(e) => this.handleChange(e, 'primaryResidence', 0)}
                    placeholder="Asset Value"
                    className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
                    disabled={!isEditing}
                  />
                  <input
                    type="number"
                    name="liabilityValue"
                    value={this.state.primaryResidence[0].liabilityValue}
                    onChange={(e) => this.handleChange(e, 'primaryResidence', 0)}
                    placeholder="Liability Value"
                    className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
                    disabled={!isEditing}
                  />
                  <input
                    type="text"
                    name="bankName"
                    value={this.state.primaryResidence[0].bankName}
                    onChange={(e) => this.handleChange(e, 'primaryResidence', 0)}
                    placeholder="Bank Name"
                    className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
                    disabled={!isEditing}
                  />
                  <input
                    type="text"
                    name="householdContentsValue"
                    value={this.state.primaryResidence[0].householdContentsValue}
                    onChange={(e) => this.handleChange(e, 'primaryResidence', 0)}
                    placeholder="Household Contents Value"
                    className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
                    disabled={!isEditing}
                  />
                  <select
                    name="benificiary_BequethedTo"
                    value={this.state.primaryResidence[0].benificiary_BequethedTo}
                    onChange={(e) => this.handleChange(e, 'primaryResidence', 0)}
                    className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
                    disabled={!isEditing}
                  >
                    <option value="" className="p-4" aria-disabled>
                      Choose...
                    </option>
                    <option value="Benificiary" className="p-4">
                      Bequethed to your spouse
                    </option>
                    <option value="BequethedTo">
                      Bequethed to somebody else
                    </option>
                    <option value="BequethedTo">
                      Form part of residue of Estate
                    </option>
                  </select>
                </div>
              )}
            </div>
            {/* Motor Vehicles */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.toggleMotorVehicles}
              >
                Motor Vehicles
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showMotorVehicles ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showMotorVehicles && (
                <>
                  {motorVehicles.map((vehicle, index) => (
                    <MotorVehicle
                      key={index}
                      vehicle={vehicle}
                      index={index}
                      handleChange={this.handleChangeVehicle}
                      handleRemove={this.handleRemoveVehicle}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddVehicle}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>

                  </button>
                </>
              )}
            </div>
            {/* Property */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.toggleProperties}
              >
                Property
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showProperties ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showProperties && (
                <>
                  {properties.map((property, index) => (
                    <Property
                      key={index}
                      property={property}
                      index={index}
                      handleChange={this.handleChangeProperty}
                      handleRemove={this.handleRemoveProperty}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddProperty}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  </button>
                </>
              )}
            </div>
            {/* Cash */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.toggleCashAccounts}
              >
                Cash
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showCashAccounts ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showCashAccounts && (
                <>
                  {cashAccounts.map((cash, index) => (
                    <Cash
                      key={index}
                      cash={cash}
                      index={index}
                      handleChange={this.handleChangeCash}
                      handleRemove={this.handleRemoveCash}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddCash}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  </button>
                </>
              )}
            </div>
            {/* Company Ownership */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.toggleCompanies}
              >
                Company Ownership
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showCompanies ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showCompanies && (
                <>
                  {companies.map((company, index) => (
                    <Company
                      key={index}
                      company={company}
                      index={index}
                      handleChange={this.handleChangeCompany}
                      handleRemove={this.handleRemoveCompany}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddCompany}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  </button>
                </>
              )}
            </div>
            {/* Short Term Loans */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.toggleShortTermLoans}
              >
                Short Term Loans
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showShortTermLoans ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showShortTermLoans && (
                <>
                  {shortTermLoans.map((loan, index) => (
                    <ShortTermLoan
                      key={index}
                      loan={loan}
                      index={index}
                      handleChange={this.handleChangeShortTermLoan}
                      handleRemove={this.handleRemoveShortTermLoan}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddShortTermLoan}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  </button>
                </>
              )}
            </div>
            {/* Personal Loans */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.togglePersonalLoans}
              >
                Personal Loans
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showPersonalLoans ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showPersonalLoans && (
                <>
                  {personalLoans.map((loan, index) => (
                    <PersonalLoan
                      key={index}
                      loan={loan}
                      index={index}
                      handleChange={this.handleChangePersonalLoan}
                      handleRemove={this.handleRemovePersonalLoan}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddPersonalLoan}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  </button>
                </>
              )}
            </div>
            {/* Lifestyle Expenses */}
            <div>
              <div
                className="bg-myBlue-300 w-[85vw] p-2 text-white rounded-lg cursor-pointer flex flex-row justify-between hover:bg-myYellow-100"
                onClick={this.toggleLifestyleExpenses}
              >
                Lifestyle Expenses
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className={`size-6 ${showLifestyleExpenses ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showLifestyleExpenses && (
                <>
                  {lifestyleExpenses.map((expense, index) => (
                    <LifestyleExpense
                      key={index}
                      expense={expense}
                      index={index}
                      handleChange={this.handleChangeLifestyleExpense}
                      handleRemove={this.handleRemoveLifestyleExpense}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100 my-1"
                    onClick={this.handleAddLifestyleExpense}
                    disabled={!isEditing}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withNavigate(Profile);
