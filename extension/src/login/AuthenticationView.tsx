import React, { useRef, useState } from "react";
import {
    VStack,
    Box, Button, Text, Heading,
    Flex,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    IconButton,
    FormErrorMessage,
    Toast,
    Alert
} from "@chakra-ui/react";
import { ArrowBackIcon, EmailIcon } from "@chakra-ui/icons";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Field, Formik, useFormik } from "formik";
import { emailLogin, emailRegistration } from "../api/auth";
import { type } from "os";


function EmailAuth(props: actionPropsContainer) {

    return <>
        <Box bg="white" p={6} rounded="md" maxW="md" w="70%" minW="70%">
            {props.formMessage && <Alert status='success'>{props.formMessage}</Alert>}
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                    rememberMe: false
                }}
                onSubmit={(values, formik) => {
                    if (props.authType == "signup") {
                        emailRegistration({ email: values.email, password: values.password })
                            .then(d => {
                                props.onRegistrationSuccess({
                                    source: "email"
                                })

                                formik.resetForm();
                            })
                            .catch(err => {
                                console.log(err)
                                for (const val in values) {
                                    var err_obj = Object.entries(err).find(([k]) => k.includes(val));

                                    if (err_obj) {
                                        const messages = err_obj[1] as any;
                                        console.log(val, messages)

                                        formik.setFieldError(val, messages.join("\n"))
                                    } else {
                                        // check if its non_field_errors
                                        const non_field_err = err['non_field_errors']

                                        if (non_field_err) {
                                            formik.setFieldError("email", non_field_err.join("\n"))
                                        }
                                    }

                                }
                            })
                    }
                    else if (props.authType == "login") {
                        emailLogin({ email: values.email, password: values.password })
                            .then(d => props.onLoginSuccess({
                                source: "email",
                                emailCredentials: {
                                    key: d.key
                                }
                            }))
                            .catch(err => {
                                console.log(err)
                                for (const val in values) {
                                    var err_obj = Object.entries(err).find(([k]) => k.includes(val));

                                    if (err_obj) {
                                        const messages = err_obj[1] as any;
                                        console.log(val, messages)

                                        formik.setFieldError(val, messages.join("\n"))
                                    } else {
                                        // check if its non_field_errors
                                        const non_field_err = err['non_field_errors']

                                        if (non_field_err) {
                                            formik.setFieldError("email", non_field_err.join("\n"))
                                        }
                                    }

                                }
                            })
                    } else {
                        throw new Error("Cannot determine email authentication type.")
                    }

                }}>
                {({ handleSubmit, errors, touched }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="flex-start">
                                <FormControl isInvalid={!!errors.email && touched.email}>
                                    <FormLabel htmlFor="email">Email Address</FormLabel>
                                    <Field
                                        as={Input}
                                        id="email"
                                        name="email"
                                        type="email"
                                        variant="filled"
                                        validate={(value) => {
                                            let error;

                                            if (value.length < 6) {
                                                error = "Password must contain at least 6 characters";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.password && touched.password}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Field
                                        as={Input}
                                        id="password"
                                        name="password"
                                        type="password"
                                        variant="filled"
                                        validate={(value) => {
                                            let error;

                                            if (value.length < 6) {
                                                error = "Password must contain at least 6 characters";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                                </FormControl>

                                <Button type="submit" colorScheme="purple" width="full">
                                    {props.authType == "signup" ? "Register" : "Login"}
                                </Button>
                            </VStack>
                        </form>
                    )
                }}
            </Formik>
        </Box>
    </>
}

interface actionPropsContainer {
    authType: "login" | "signup"
    setAuthType: { (authType: "login" | "signup"): void },
    onLoginSuccess: { (loginReturnType: loginReturnType): void },
    onRegistrationSuccess: { (registrationReturnType): void },
    showForm?: boolean,
    formMessage?: string
}

function ActionContainer(props: actionPropsContainer) {
    const [showForm, setShowForm] = useState<boolean>(props.showForm)

    return <>
        {!showForm ?
            <VStack marginTop="10px">
                <GoogleLogin
                    context={props.authType == "signup" ? "signup" : "signin"}
                    text={props.authType == "signup" ? "signup_with" : "signin"}
                    onSuccess={e =>
                        props.authType == "signup" ? props.onRegistrationSuccess({
                            source: "google",
                            google_creds: e
                        }) : props.onLoginSuccess({
                            source: "google",
                            google_creds: e
                        })
                    }
                    width="300"
                    onError={() => {
                        console.log('Login Failed')
                    }} />
                <Button width="300px"
                    marginTop="10px"
                    leftIcon={<EmailIcon />}
                    bg='blue.400'
                    onClick={() => setShowForm(true)}
                    color='white'
                    variant='solid'>{props.authType == "signup" ? "Sign up with Email" : "Sign in with Email"}
                </Button>

                {props.authType == "signup"
                    ? <Flex align="left" marginTop="10px">
                        <Text align="left">Already a member?</Text>
                        <Button onClick={() => props.setAuthType("login")} marginLeft="5px" colorScheme='blue' variant='link'>
                            Log in
                        </Button>
                    </Flex>
                    : <Flex align="left" marginTop="10px">
                        <Text align="left">Want to register?</Text>
                        <Button onClick={() => props.setAuthType("signup")} marginLeft="5px" colorScheme='blue' variant='link'>
                            Join now
                        </Button>
                    </Flex>
                }
            </VStack>
            :
            <>
                <IconButton variant='outline' aria-label='Back' icon={<ArrowBackIcon />} onClick={() => setShowForm(!showForm)} />
                <Flex align="center" justify="center">
                    <EmailAuth {...props} />
                </Flex>
            </>
        }</>
}

export interface loginReturnType {
    source: "google" | "email"
    google_creds?: CredentialResponse,
    emailCredentials?: {
        key: string
    }
}

export interface registrationReturnType {
    source: "google" | "email"
    google_creds?: CredentialResponse,
    emailCredentials?: {
        key: string
    }
}

interface AuthenticationView {
    onLoginSuccess: { (loginReturnType): void },
    onRegistrationSuccess: { (registrationReturnType): void }
}

export function AuthPopup(props: AuthenticationView) {
    const [type, setType] = useState<"login" | "signup">("signup");
    const [loginRedirectMessage, setLoginRedirectMessage] = useState<string>(null);

    const onRegistrationSuccess = (r: registrationReturnType) => {

        if (r.source == "email") {
            setType("login");
            setLoginRedirectMessage("Account registered! Please login with your credentials.");
        }

        if (props.onRegistrationSuccess) {
            props.onRegistrationSuccess(r);
        }
    }

    return (
        <Box margin="15%">
            <Heading marginBottom="20px" size='sm'>{type == "signup" ? "Join Unboxr" : "Sign into Unboxr"}</Heading>

            <ActionContainer
                setAuthType={setType}
                authType={type}
                onLoginSuccess={props.onLoginSuccess}
                onRegistrationSuccess={onRegistrationSuccess}
                showForm={loginRedirectMessage != null}
                formMessage={loginRedirectMessage}
            />
        </Box>
    );
}

