import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { request } from "../../util/request";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      email,
      token,
      password: formData.password,
      password_confirmation:
        formData.password_confirmation,
    };

    const res = await request(
      "/reset-password",
      "post",
      payload
    );

    setLoading(false);

    if (res?.error) {
      setErrors(res.errors || {});
      return;
    }

    alert(res.message);

    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>

      <form onSubmit={onSubmit}>
        <div>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={onChange}
          />

          {errors?.validation?.password && (
            <small style={{ color: "red" }}>
              {errors.validation.password[0]}
            </small>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={onChange}
          />

          {errors?.validation
            ?.password_confirmation && (
            <small style={{ color: "red" }}>
              {
                errors.validation
                  .password_confirmation[0]
              }
            </small>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>

      {!token && (
        <p style={{ color: "red" }}>
          Invalid reset token.
        </p>
      )}
    </div>
  );
}