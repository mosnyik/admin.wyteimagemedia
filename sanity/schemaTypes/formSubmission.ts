import {defineType} from 'sanity'
import {MdAssignment as icon} from 'react-icons/md'

export default defineType({
  name: 'formSubmission',
  title: 'Form Submission',
  type: 'document',
  icon,
  fields: [
    // Personal Info
    {name: 'surname', type: 'string', title: 'Surname'},
    {name: 'firstName', type: 'string', title: 'First Name'},
    {name: 'otherNames', type: 'string', title: 'Other Names'},
    {name: 'dateOfBirth', type: 'date', title: 'Date of Birth'},
    {name: 'age', type: 'string', title: 'Age'},

    // Contact Info
    {name: 'phoneNumbers', type: 'string', title: 'Phone Numbers'},
    {name: 'whatsappPhone', type: 'string', title: 'WhatsApp Number'},
    {name: 'email', type: 'string', title: 'Email'},
    {name: 'countryOfResidence', type: 'string', title: 'Country of Residence'},
    {name: 'cityOrTown', type: 'string', title: 'City or Town'},
    {name: 'postCOdeOrStreet', type: 'string', title: 'Post Code / Street'},

    // Background / Status
    {name: 'profession', type: 'string', title: 'Profession'},
    {
      name: 'maritalStatus',
      type: 'string',
      title: 'Marital Status',
      options: {
        list: [
          {title: 'Single', value: 'single'},
          {title: 'Married', value: 'married'},
          {title: 'Widowed', value: 'widowed'},
          {title: 'Divorced', value: 'divorced'},
        ],
      },
    },
    {
      name: 'givenBirth',
      type: 'string',
      title: 'Given Birth?',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {title: 'No', value: 'no'},
        ],
      },
    },
    {name: 'numberOfChildren', type: 'string', title: 'Number of Children'},

    {
      name: 'stillInSchool',
      type: 'string',
      title: 'Still in School?',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {title: 'No', value: 'no'},
        ],
      },
    },
    {name: 'institutionName', type: 'string', title: 'Institution Name'},

    {
      name: 'alreadyGraduated',
      type: 'string',
      title: 'Already Graduated?',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {title: 'No', value: 'no'},
        ],
      },
    },
    {name: 'discipline', type: 'string', title: 'Discipline'},

    {
      name: 'workingClassLady',
      type: 'string',
      title: 'Working Class Lady?',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {title: 'No', value: 'no'},
        ],
      },
    },
    {name: 'company', type: 'string', title: 'Company'},
    {name: 'position', type: 'string', title: 'Position'},
    {name: 'businessNature', type: 'string', title: 'Nature of Business'},

    // Images
    {
      name: 'image1',
      title: 'Image 1',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'image2',
      title: 'Image 2',
      type: 'image',
      options: {hotspot: true},
    },

    // Submission timestamp
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },

    // ============================
    // 🔍 SCREENING SYSTEM
    // ============================

    {
      name: 'screeningStatus',
      title: 'Screening Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Screened', value: 'screened'},
          {title: 'Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'pending',
    },

    {
      name: 'isDisqualified',
      title: 'Disqualified?',
      type: 'boolean',
      initialValue: false,
    },

    {
      name: 'disqualificationReason',
      title: 'Disqualification Reason',
      type: 'text',
      hidden: ({parent}) => parent?.isDisqualified !== true,
    },

    {
      name: 'screenedBy',
      title: 'Screened By (Admin Name)',
      type: 'string',
    },

    {
      name: 'screenedAt',
      title: 'Screened At',
      type: 'datetime',
    },
    // ============================
    // 🔍 VOTING SECTION
    // ============================

    {
      name: 'votesReceived',
      title: 'Votes Received',
      type: 'string',
    },
    {
      name: 'totalAmountFromVotes',
      title: 'Total Amount From Votes',
      type: 'string',
    },
  ],

  preview: {
    select: {
      title: 'firstName',
      surname: 'surname',
      media: 'image1',
      status: 'screeningStatus',
    },
    prepare({title, surname, media, status}) {
      return {
        title: `${title} ${surname}`,
        subtitle: `Status: ${status}`,
        media,
      }
    },
  },
})
