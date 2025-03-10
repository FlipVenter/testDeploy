import React from "react";
import trash from "./../../public/assets/images/trash.svg"; // Import the icon

const ShortTermLoan = ({
  loan,
  index,
  handleChange,
  handleRemove,
  isEditing,
}) => {
  return (
    <div className="bg-white w-[80vwv] py-2 text-white rounded-lg flex flex-row justify-start gap-5 items-center box-border overflow-hidden">
      <select
        name={`type-${index}`}
        value={loan.type}
        onChange={(e) => handleChange(e, index)}
        placeholder="Type"
        className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
        disabled={!isEditing}
      >
        <option value="" className="p-4" aria-disabled>
          Choose...
        </option>
        <option value="Personal" className="p-4">
          Overdraft
        </option>
        <option value="Personal" className="p-4">
          CreditCard
        </option>
      </select>
      <input
        type="nunmber"
        name={`liabilityValue-${index}`}
        value={loan.liabilityValue}
        onChange={(e) => handleChange(e, index)}
        placeholder="Liability Value"
        className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
        disabled={!isEditing}
      />
      <input
        type="text"
        name={`bankName-${index}`}
        value={loan.bankName}
        onChange={(e) => handleChange(e, index)}
        placeholder="Bank Name"
        className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
        disabled={!isEditing}
      />
      <select
        name={`benificiary_BequethedTo-${index}`}
        value={loan.benificiary_BequethedTo}
        onChange={(e) => handleChange(e, index)}
        placeholder="choose.."
        className="text-black rounded-lg shadow-inner shadow-gray-400 p-2 w-[12vw] h-[5vh] box-border"
        disabled={!isEditing}
      >
        <option value="" className="p-4" aria-disabled>
          Choose...
        </option>
        <option value="Benificiary" className="p-4">
          Bequethed to your spouse
        </option>
        <option value="BequethedTo">Bequethed to somebody else</option>
        <option value="BequethedTo">Form part of residue of Estate</option>
      </select>
      <button
        className="bg-myBlue-300 p-2 aspect-square rounded-lg max-w-[3vw] box-border hover:bg-myYellow-100"
        onClick={() => handleRemove(index)}
        disabled={!isEditing}
      >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
      </button>
    </div>
  );
};

export default ShortTermLoan;
