
<style scoped>

    .box {
        width: 100%;
        height: 100%;
        background: #00000060;
        position: absolute;
        box-sizing: border-box;
        padding: 40px;
    }
    .form-control{
        height: 40px;
        box-shadow: none;
        color: #969fa4;
    }
    .form-control:focus{
        border-color: #5cb85c;
    }
    .signup-form{
        width: 400px;
        margin: 0 auto;
        padding: 30px 0;
        position: relative;
        overflow-y: auto;
    }
    .signup-form h2{
        color: #636363;
        margin: 0 0 15px;
        position: relative;
        text-align: center;
    }
    .signup-form .form-group{
        margin-bottom: 20px;
    }

</style>

<template>

    <Form @submit="handleData" :validation-schema="dataSchema">
        <div class="signup-form text-monospace">
            <div class="text-center">
                <h2 class="font-weight-bold display-5 text-dark text-monospace">{{ $t('announcementPage.addAnnouncement') }}</h2>
            </div>
            <div v-if="!successful">
                <div class="form-group">
                    <label for="monthly">{{ $t('announcementPage.monthlyAward') }}</label>
                    <Field name="monthly" type="text" class="form-control" />
                    <ErrorMessage name="monthly" class="error-feedback" />

                    <label for="monthlyPhoto">{{ $t('announcementPage.addPhoto') }}</label>
                    <Field name="monthlyPhoto" type="file" rules="image" />
                    <ErrorMessage name="monthlyPhoto" class="error-feedback" />
                </div>
                <div class="form-group">
                    <label for="annual">{{ $t('announcementPage.annualAward') }}</label>
                    <Field name="annual" type="text" class="form-control" />
                    <ErrorMessage name="annual" class="error-feedback" />

                    <div class="form-group">
                    <label for="annualPhoto">{{ $t('announcementPage.addPhoto') }}</label>
                    <Field name="annualPhoto" type="file" rules="image" />
                    <ErrorMessage name="annualPhoto" class="error-feedback" />
                </div>
                <div class="form-group">
                    <button class="btn btn-outline-light btn-block" :disabled="loading">
                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                        {{ $t('announcementPage.submit') }}
                    </button>
                </div>
            </div>
        </div>
        </div>
    </Form>

    <div v-if="message" class="alert alert-danger" :class="successful ? 'alert-success' : 'alert-danger'">
        {{ message }}
    </div>

</template>

<script lang="ts" type="text/typescript">

import { defineComponent } from 'vue'
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default defineComponent({
    name: "Announcement",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data: function() {
        const supportedFileTypes = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
        const dataSchema = yup.object().shape({
            monthly: yup
                .string(),
            annual: yup
                .string(),
            monthlyPhoto: yup
                .mixed()
                .notRequired()
                .default("-")
                .test(
                    "fileTypeCheck",
                    "Unsupported file type",
                    (value) => { 
                        return supportedFileTypes.includes(value[0].type) || value == "-";
                    }
                ),
            annualPhoto: yup
                .mixed()
                .notRequired()
                .default("-")
                .test(
                    "fileTypeCheck",
                    "Unsupported file type",
                    (value) => { 
                        return supportedFileTypes.includes(value[0].type) || value == "-";
                    }
                ),

        });
        return {
            successful: false,
            loading: false,
            message: "",
            dataSchema,
        };
    },
    methods: {

        handleData(entry) {
            let token = JSON.parse(localStorage.getItem('user')!);
            if(token != null) {

                let formData = new FormData();
                if(entry.monthlyPhoto){
                    for(let p of entry.monthlyPhoto){
                        formData.append("monthlyPhoto", p);
                    }
                }
                if(entry.annualPhoto){
                    for(let p of entry.annualPhoto){
                        formData.append("annualPhoto", p);
                    }
                }
                delete entry["monthlyPhoto"];
                delete entry["annualPhoto"];
                formData.append("data", new Blob([JSON.stringify(entry)], {
                                type: "application/json"
                            }));

                this.$axios.post("/api/announcements/submit", formData, {
                    headers: {
                        'Authorization': `Bearer ${token.jwt}`,
                    }
                }).then(response => {
                        this.message = response.data;
                        this.successful = true;
                        this.loading = false;
                        if(response != null) {
                            console.log("entry successful: " + this.successful);
                            this.$router.push("/");
                        } else {
                            alert("entry could not be submitted");
                        }
                    }
                ).catch((error: any) => {
                      this.message =
                          (error.response &&
                          error.response.data &&
                          error.response.data.message) ||
                          error.message;
                      this.successful = false;
                      this.loading = false;
                      alert("entry could not be submitted");
                });
            }
        },

    }
});

</script>

