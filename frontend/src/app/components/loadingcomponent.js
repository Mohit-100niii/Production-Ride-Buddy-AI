export default function Loader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "4px solid #A855F7",          // Purple border
          borderTop: "4px solid transparent",   // Spinner top transparent
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: "1rem", color: "#4B5563" }}>Logging you in...</p>

      {/* Inline keyframe definition using a style tag */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
