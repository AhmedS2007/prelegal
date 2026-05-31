import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NDAForm from "@/components/NDAForm";
import { defaultFormData, NDAFormData } from "@/lib/types";

const mockOnChange = jest.fn();

const renderForm = (overrides: Partial<NDAFormData> = {}) => {
  const value = { ...defaultFormData, ...overrides };
  return render(<NDAForm value={value} onChange={mockOnChange} />);
};

beforeEach(() => mockOnChange.mockClear());

/* ── Rendering ──────────────────────────────────── */

describe("NDAForm rendering", () => {
  it("renders the Purpose section heading", () => {
    renderForm();
    expect(screen.getByText("Purpose")).toBeInTheDocument();
  });

  it("renders the Effective Date section heading", () => {
    renderForm();
    expect(screen.getByText("Effective Date")).toBeInTheDocument();
  });

  it("renders the MNDA Term section heading", () => {
    renderForm();
    expect(screen.getByText("MNDA Term")).toBeInTheDocument();
  });

  it("renders the Term of Confidentiality section heading", () => {
    renderForm();
    expect(screen.getByText("Term of Confidentiality")).toBeInTheDocument();
  });

  it("renders the Governing Law & Jurisdiction section heading", () => {
    renderForm();
    expect(
      screen.getByText("Governing Law & Jurisdiction")
    ).toBeInTheDocument();
  });

  it("renders the Parties section heading", () => {
    renderForm();
    expect(screen.getByText("Parties")).toBeInTheDocument();
  });

  it("renders Party 1 and Party 2 labels", () => {
    renderForm();
    expect(screen.getByText("Party 1")).toBeInTheDocument();
    expect(screen.getByText("Party 2")).toBeInTheDocument();
  });

  it("renders the MNDA Modifications section heading", () => {
    renderForm();
    expect(screen.getByText("MNDA Modifications")).toBeInTheDocument();
  });

  it("renders the reset button", () => {
    renderForm();
    expect(
      screen.getByRole("button", { name: /reset to defaults/i })
    ).toBeInTheDocument();
  });

  it("pre-fills inputs with the provided value", () => {
    renderForm({ governingLawState: "California" });
    expect(
      screen.getByPlaceholderText("Delaware")
    ).toHaveValue("California");
  });

  it("shows the year input for MNDA term when mndaTermType is expires", () => {
    renderForm({ mndaTermType: "expires" });
    // The number input for mndaTermYears should be visible
    const numberInputs = screen
      .getAllByRole("spinbutton")
      .filter((el) => (el as HTMLInputElement).value === "1");
    expect(numberInputs.length).toBeGreaterThan(0);
  });

  it("hides the year input for MNDA term when mndaTermType is until_terminated", () => {
    renderForm({ mndaTermType: "until_terminated" });
    // There should be only one spinbutton (confidentiality years)
    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons).toHaveLength(1);
  });
});

/* ── Purpose textarea ───────────────────────────── */

describe("Purpose textarea", () => {
  it("calls onChange with updated purpose when text changes", () => {
    renderForm({ purpose: "" });
    const textarea = screen.getAllByRole("textbox")[0];
    fireEvent.change(textarea, { target: { value: "New purpose text" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ purpose: "New purpose text" })
    );
  });
});

/* ── Effective Date ─────────────────────────────── */

describe("Effective Date input", () => {
  it("calls onChange with updated effectiveDate", () => {
    renderForm();
    const dateInput = screen.getByDisplayValue(defaultFormData.effectiveDate);
    fireEvent.change(dateInput, { target: { value: "2025-06-01" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ effectiveDate: "2025-06-01" })
    );
  });
});

/* ── MNDA Term radios ───────────────────────────── */

describe("MNDA Term radio buttons", () => {
  it("calls onChange with mndaTermType 'until_terminated' when second radio is clicked", () => {
    renderForm({ mndaTermType: "expires" });
    const radios = screen.getAllByRole("radio");
    // radios[0] = expires, radios[1] = until_terminated,
    // radios[2] = confidentiality years, radios[3] = perpetuity
    fireEvent.click(radios[1]);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: "until_terminated" })
    );
  });

  it("calls onChange with mndaTermType 'expires' when first radio is clicked", () => {
    renderForm({ mndaTermType: "until_terminated" });
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: "expires" })
    );
  });

  it("calls onChange with updated mndaTermYears when number input changes", () => {
    renderForm({ mndaTermType: "expires", mndaTermYears: 1 });
    const yearInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(yearInput, { target: { value: "3" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermYears: 3 })
    );
  });
});

/* ── Confidentiality Term radios ────────────────── */

describe("Term of Confidentiality radio buttons", () => {
  it("calls onChange with confidentialityTermType 'perpetuity' when perpetuity radio is clicked", () => {
    renderForm({ confidentialityTermType: "years" });
    const radios = screen.getAllByRole("radio");
    // perpetuity is the last radio (index 3 when mndaTermType is expires)
    fireEvent.click(radios[radios.length - 1]);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermType: "perpetuity" })
    );
  });

  it("calls onChange with confidentialityTermYears when number input changes", () => {
    renderForm({
      mndaTermType: "expires",
      confidentialityTermType: "years",
      confidentialityTermYears: 1,
    });
    const spinbuttons = screen.getAllByRole("spinbutton");
    // Second spinbutton is confidentiality years
    fireEvent.change(spinbuttons[1], { target: { value: "5" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermYears: 5 })
    );
  });
});

/* ── Governing Law & Jurisdiction ───────────────── */

describe("Governing Law & Jurisdiction inputs", () => {
  it("calls onChange with updated governingLawState", () => {
    renderForm({ governingLawState: "" });
    const input = screen.getByPlaceholderText("Delaware");
    fireEvent.change(input, { target: { value: "Texas" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ governingLawState: "Texas" })
    );
  });

  it("calls onChange with updated jurisdictionDescription", () => {
    renderForm({ jurisdictionDescription: "" });
    const input = screen.getByPlaceholderText(
      "courts located in New Castle, DE"
    );
    fireEvent.change(input, { target: { value: "courts located in Austin, TX" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        jurisdictionDescription: "courts located in Austin, TX",
      })
    );
  });
});

/* ── Party fields ───────────────────────────────── */

describe("Party fields", () => {
  it("calls onChange with updated party1 company name", () => {
    renderForm();
    const companyInputs = screen.getAllByPlaceholderText("Acme Corp.");
    fireEvent.change(companyInputs[0], { target: { value: "NewCo" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        party1: expect.objectContaining({ company: "NewCo" }),
      })
    );
  });

  it("calls onChange with updated party2 company name independently from party1", () => {
    renderForm();
    const companyInputs = screen.getAllByPlaceholderText("Acme Corp.");
    fireEvent.change(companyInputs[1], { target: { value: "OtherCo" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        party2: expect.objectContaining({ company: "OtherCo" }),
      })
    );
  });

  it("calls onChange with updated party1 signatory name", () => {
    renderForm();
    const nameInputs = screen.getAllByPlaceholderText("Jane Smith");
    fireEvent.change(nameInputs[0], { target: { value: "Alice Johnson" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        party1: expect.objectContaining({ signatoryName: "Alice Johnson" }),
      })
    );
  });

  it("calls onChange with updated notice address", () => {
    renderForm();
    const addressInputs = screen.getAllByPlaceholderText("jane@acme.com");
    fireEvent.change(addressInputs[0], { target: { value: "ceo@company.com" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        party1: expect.objectContaining({ noticeAddress: "ceo@company.com" }),
      })
    );
  });
});

/* ── Reset button ───────────────────────────────── */

describe("Reset button", () => {
  it("calls onChange with defaultFormData when reset is clicked", async () => {
    const user = userEvent.setup();
    renderForm({ governingLawState: "Texas" });
    const resetBtn = screen.getByRole("button", { name: /reset to defaults/i });
    await user.click(resetBtn);
    expect(mockOnChange).toHaveBeenCalledWith(defaultFormData);
  });
});
