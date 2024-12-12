import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Paper } from "@mui/material";
import googlePng from "../assets/google.png";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  signInWithGoogle,
} from "../features/auth/authSlice";
import LoadingButton from "@mui/lab/LoadingButton";

const ValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password must have min 8 chars")
    .max(16, "Password must have max 16 chars"),
  name: yup
    .string()
    .min(3, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
});

// Formik'den gelen her türlü veriyi almak için props kullanıyoruz.
const LoginAndRegisterForm = (props) => {
  const dispatch = useDispatch();

  const handleGoogleProvider = () => {
    dispatch(signInWithGoogle());
  };

  const { handleChange, errors, values, touched } = props;

  return (
    <Form>
      {props.method === "Register" ? (
        <TextField
          margin="normal"
          id="name"
          label="Kullancı ismi"
          name="name"
          type="text"
          // Aşağıdaki autoComplete alanlarını kapattım.
          // Çünkü tarayıcı uzantılarını tetikliyor. background.js:2'de bir çok uyarı veriyor. Uygulama ile direk ilgisi yok. Ama kapatınca çözüldü.
          // autoComplete="name"
          autoFocus
          onChange={handleChange}
          placeholder="Kullancı isminizi giriniz"
          fullWidth
          value={values.name}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
      ) : null}
      <TextField
        margin="normal"
        id="email"
        label="E-Posta"
        name="email"
        // autoComplete="email"
        onChange={handleChange}
        placeholder="E-Posta adresinizi giriniz"
        fullWidth
        value={values.email}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
      />

      <TextField
        margin="normal"
        id="password"
        label="Parola"
        name="password"
        type="password"
        placeholder="Parolanızı giriniz"
        fullWidth
        onChange={handleChange}
        value={values.password}
        error={touched.password && Boolean(errors.password)}
        helperText={touched.password && errors.password}
      />
      {props.loading ? (
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            textTransform: "none",
            backgroundColor: "buttonBg.main",
          }}
          loading
        >
          {props.method}
        </LoadingButton>
      ) : (
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            textTransform: "none",
            backgroundColor: "buttonBg.main",
          }}
        >
          {props.method === "Login" ? "Giriş yap" : "Kayıt ol"}
        </LoadingButton>
      )}
      <Button
        fullWidth
        variant="contained"
        onClick={handleGoogleProvider}
        sx={{
          backgroundColor: "#fdfdfd",
          fontWeight: "bold",
          color: "#6d6d6d",
          mt: 3,
          textTransform: "none",
        }}
      >
        <img
          src={googlePng}
          alt="google"
          style={{ width: "70px", marginLeft: "10px" }}
        />
        <span style={{ marginLeft: "10px" }}>ile giris yap</span>
      </Button>
    </Form>
  );
};

const Autorization = ({ method }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  // history'de, user'da bir değişiklilk olursa ana sayfaya yönlendir
  // user'daki değişiklik -> logout olduğunda. ekstra bir güvenlik önlemi olarak düşünebiliriz
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Container sx={{ maxWidth: "30rem !important", marginTop: "3rem" }}>
      <Paper elevation={24} square={false} sx={{ padding: "1rem" }}>
        <Typography variant="h4" align="center" mt={4} color="primary.main">
          {method === "Login" ? "Giriş yap" : "Kayıt ol"}
        </Typography>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Formik
            initialValues={{
              name: "", //! ekledim
              email: "",
              password: "",
            }}
            validationSchema={ValidationSchema}
            // values -> form'dan gelen değerler, mail'in, password'un değerleri.
            // actions -> form submit edildi mi?, form resetlensin mi?
            // formik ile gelen bir sürü özelliği kullanmayı sağlayan bu parametredir.
            onSubmit={(values, actions) => {
              if (method === "Login") {
                try {
                  dispatch(
                    loginUser({
                      email: values.email,
                      password: values.password,
                    })
                  );
                  actions.setSubmitting(false);
                } catch (error) {
                  actions.setSubmitting(false);
                  actions.resetForm();
                }
              } else {
                try {
                  dispatch(
                    registerUser({
                      username: values.name, //! ekledim
                      email: values.email,
                      password: values.password,
                    })
                  );
                  actions.setSubmitting(false);
                } catch (error) {
                  actions.setSubmitting(false);
                  actions.resetForm();
                }
              }
            }}
            // form kısmını bu şekilde ayrı bir komponent olarak yazabilirsin.
            // bu şekilde yaptığında form kısmı uzadığında Formik içerisinde karmaşıklığa sebep olmaz.
            component={(props) => (
              // yukarıdan (LoginRegister ve Autorization) gelen method bilgisini gönderiyoruz.
              // Formik'den gelen diğer propları almak için {...porps}
              <LoginAndRegisterForm
                method={method}
                {...props}
                loading={loading}
              />
            )}
          ></Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default Autorization;

//? Formik'in 3 temel saç ayağı vardır
// 1- initialValues
// 2- validationSchema -> biz yup ile yaptık
// 3- onSubmit -> submit butonuna basıldığında nelerin çalışacağını belirliyoruz.
// 4- component (isteğe bağlı) (form elemanları için)
