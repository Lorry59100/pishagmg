import axios from "axios";
import { Formik, Form, Field } from 'formik';
import { FaFacebookF, FaApple, FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import PropTypes from "prop-types";
import { ToastError } from "../../../services/ToastService";
import { useContext, useEffect } from "react";
import { CartContext } from "../../../contexts/CartContext";
import { useTokenService } from "../../../services/TokenService";

export function LoginForm({ toggleForm, onFormSuccess, onForgotPasswordClick }) {
  const { login } = useTokenService();
  const { updateCart } = useContext(CartContext);
  const initialValues = {
    email: '',
    password: '',
  };
  const URL = import.meta.env.VITE_BACKEND;
  const URL_LOGIN = import.meta.env.VITE_LOGIN;
  const URL_FORGOTTEN_PASSWORD = import.meta.env.VITE_FORGOTTEN_PASSWORD;

  const onSubmit = (values) => {
    const cartItems = JSON.parse(localStorage.getItem('cart'));

    axios.post(`${URL}${URL_LOGIN}`, {
      email: values.email,
      password: values.password,
      cart: cartItems,
    })
    .then((response) => {
      if (response.status === 200) {
        login(response.data.token);
        localStorage.removeItem('cart');
        updateCart(response.data.cart);
        onFormSuccess(); // Appel de la fonction de rappel après une soumission réussie
        if (response.data.exceedsLimit) {
          ToastError(response.data.errorMessage);
        }
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des données :', error);
      ToastError(error.response.data.error);
    });
  };

  useEffect(() => {
    // Ajouter une classe pour désactiver la barre de défilement
    document.body.classList.add('no-scroll');

    // Nettoyer la classe lorsque le composant est démonté
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="little-form-container">
      <h2>Se connecter</h2>
      <div className="logo-container">
        <div className="single-logo fb-logo">
          <IconContext.Provider value={{ size: "1.5em" }}>
            <FaFacebookF />
          </IconContext.Provider>
        </div>
        <div className="single-logo google-logo">
          <IconContext.Provider value={{ size: "1.5em" }}>
            <FcGoogle />
          </IconContext.Provider>
        </div>
        <div className="single-logo apple-logo">
          <IconContext.Provider value={{ size: "1.5em" }}>
            <FaApple />
          </IconContext.Provider>
        </div>
        <div className="single-logo discord-logo">
          <IconContext.Provider value={{ size: "1.5em" }}>
            <FaDiscord />
          </IconContext.Provider>
        </div>
      </div>
      <div className="cutline-form first-cutline">
        <span className="cutline-text">OU</span>
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <div className="fields-container">
            <Field type="email" name="email" placeholder="Email" />
            <Field type="password" name="password" placeholder="*********" />
          </div>
          <div className="btn-container">
            <button className="submit-button middle-column" type="submit">
              Se connecter
            </button>
          </div>
        </Form>
      </Formik>
      <div className="switch">
        <button onClick={toggleForm}>Pas encore de compte ?</button>
        <Link to={URL_FORGOTTEN_PASSWORD} onClick={onForgotPasswordClick}>Mot de passe oublié ?</Link>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onFormSuccess: PropTypes.func.isRequired,
  onForgotPasswordClick: PropTypes.func.isRequired,
};
