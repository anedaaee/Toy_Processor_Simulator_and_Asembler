library ieee;
use ieee.STD_LOGIC_1164.all;
use ieee.numeric_std.all;


entity AU is 
	generic (au_bw : integer := 16);
	port (
		a,b : in std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		c_in : in std_logic := '0';
		c_prev : in std_logic := '0';
		output : out std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		cout : out std_logic := '0'
	);
end AU;


architecture Behavioral of AU is

	signal c_in_first : std_logic_vector(au_bw - 1 downto 0) := (others => '0');
begin

	process(a,b,c_in,c_in_first)
	
		variable unsigned_a,unsigned_b,unsigned_c_in,unsigned_output : unsigned(au_bw downto 0) := (others => '0');
	begin
		unsigned_a      := ('0' & unsigned(a));
		unsigned_b      := ('0' & unsigned(b));
		unsigned_c_in   := unsigned(c_in_first & c_prev);

		if (c_in = '0') then
			unsigned_output := unsigned_a + unsigned_b;
		elsif (c_in = '1') then
			unsigned_output := unsigned_a - unsigned_b - unsigned_c_in;
		end if;

		output <= std_logic_vector(unsigned_output(au_bw - 1 downto 0));
		cout   <= std_logic(unsigned_output(au_bw));

	end process;


end Behavioral;
