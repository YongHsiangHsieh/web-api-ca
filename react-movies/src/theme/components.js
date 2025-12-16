/**
 * Component Style Overrides
 * Default styling for MUI components across the application
 */

export const components = {
  // Card component defaults
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
      },
    },
    defaultProps: {
      elevation: 0,
    },
  },

  // Button component defaults
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 600,
        padding: "8px 16px", // 1 spacing unit (8px) x 2
      },
      contained: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        },
      },
    },
  },

  // IconButton component defaults
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
        },
      },
    },
  },

  // Chip component defaults
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },

  // Paper component defaults
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
      elevation2: {
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
      elevation3: {
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
      },
    },
  },

  // TextField component defaults
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
        },
      },
    },
    defaultProps: {
      variant: "outlined",
    },
  },

  // AppBar component defaults
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
  },

  // Fab component defaults
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
        },
      },
    },
  },

  // Table component defaults
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontWeight: 600,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      },
    },
  },

  // Link component defaults
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  },

  // Typography component defaults
  MuiTypography: {
    styleOverrides: {
      gutterBottom: {
        marginBottom: "0.75em",
      },
    },
  },
};

