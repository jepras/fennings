export const deleteUserData = (data) => {
  return (dispatch, { getFirebase, getFirestore }) => {
    /* Initiate all variables */
    const firestore = getFirestore();
    const firebase = getFirebase();
    const selectedUserFormId = data.formId;
    const selectedUserUserId = data.selectedUser;

    /* Dispatch redux action */
    dispatch({ type: 'DELETE_ALL_REQUEST' });

    /* Delete saved form document */
    firestore
      .collection('forms')
      .doc(selectedUserFormId)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_ALL_SUCCESS' });
        console.log('User form deleted');
      })
      .catch((error) => {
        dispatch({ type: 'DELETE_ALL_ERROR' }, error);
        console.log("User wasn't deleted");
      });

    /* Delete user document */
    firestore
      .collection('users')
      .doc(selectedUserUserId)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_ALL_SUCCESS' });
        console.log('User deleted');
      })
      .catch((error) => {
        dispatch({ type: 'DELETE_ALL_ERROR' }, error);

        console.log("User wasn't deleted");
      });

    /* Delete stored uploads */
  };
};

export const decide = (info) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    // eslint-disable-next-line
    const profile = getState().firebase.profile;
    // const authorId = getState().firebase.auth.uid;

    dispatch({ type: 'SEND_DECISION_REQUEST' });
    firestore
      .collection('forms')
      .doc(info.formId)
      .update({
        decision: info.decision,
        decisionMadeBy: profile.fornavn,
        decisionTakenAt: new Date(),
      })
      .then(() => {
        dispatch({ type: 'SEND_DECISION_SUCCESS' });
      })
      .catch((err) => {
        dispatch({ type: 'SEND_DECISION_ERROR' }, err);
      });
  };
};

export const downloadFile = (filNavn) => {
  return (dispatch, getState, { getFirebase }) => {
    console.log('filNavn fra Redux', filNavn);

    const firebase = getFirebase();
    const authorId = getState().firebase.auth.uid;

    dispatch({ type: 'DOWNLOAD_FILE_STORAGE_REQUEST' });

    /* create ref  */
    var filRef = firebase.storage().ref(authorId).child(filNavn);

    // Get the download URL
    filRef
      .getDownloadURL()
      .then(function (url) {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        /* xhr.responseType = 'blob';
        xhr.onload = function (event) {
          var blob = xhr.response;
        }; */
        xhr.open('GET', url);
        xhr.send();

        /* url */
        console.log('url', url);

        dispatch({ type: 'DOWNLOAD_FILE_STORAGE_SUCCESS', payload: url });
      })
      .catch(function (error) {
        dispatch({ type: 'DOWNLOAD_FILE_STORAGE_ERROR' });

        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;

          default:
            break;
        }
      });
  };
};
